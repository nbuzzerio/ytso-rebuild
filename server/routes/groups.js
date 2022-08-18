const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const crypto = require("crypto");

const {
  Groups,
  validate,
  algorithm,
  key,
  iv,
} = require("../../database/models/groups");
const { User } = require("../../database/models/users");

router.get(
  "/invite/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const group = await Groups.findById({ _id: req.params.id });
    if (!group) return res.status(404).send({ error: "Group not found." });

    const member = await User.findById({ _id: req.user._id });
    if (!member) return res.status(400).send({ error: "User is not valid." });

    const currentMems = group.members.filter((member) =>
      member.member_id.equals(req.user._id)
    );
    if (currentMems.length === 0)
      return res
        .status(403)
        .send({ error: "User must be a member to get an invite code." });

    try {
      const inviteKey = group.generateInviteKey();

      res.send({ inviteKey });
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
        res.status(500).send(ex.errors[field].message);
      }
    }
  })
);
router.get(
  "/timed-invite/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const group = await Groups.findById({ _id: req.params.id });
    if (!group) return res.status(404).send({ error: "Group not found." });

    const member = await User.findById({ _id: req.user._id });
    if (!member) return res.status(400).send({ error: "User is not valid." });

    const currentMems = group.members.filter((member) =>
      member.member_id.equals(req.user._id)
    );
    if (currentMems.length === 0)
      return res
        .status(403)
        .send({ error: "User must be a member to get an invite code." });

    try {
      const inviteKey = group.generateInviteKey(true);

      res.send({ inviteKey });
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
        res.status(500).send(ex.errors[field].message);
      }
    }
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    req.body.members = [
      {
        member_id: req.body.owner_id,
        member_name: req.body.owner_name,
        isAdmin: true,
      },
    ];

    const group = new Groups(req.body);

    try {
      const owner = await User.findById({ _id: req.body.owner_id });
      const result = await group.save();
      owner.groups.push({ groupName: result.name, groupId: result._id });
      owner.save();

      res.send(result);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
        res.status(500).send(ex.errors[field].message);
      }
    }
  })
);

router.post(
  "/join/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted =
      decipher.update(req.params.id, "hex", "utf8") + decipher.final("utf8");
    const decryptedPayload = JSON.parse(decrypted);

    const expiration = new Date(decryptedPayload.expiration);
    if (expiration < new Date())
      return res.status(403).send({ error: "Invite code has expired." });

    const group = await Groups.findById({ _id: decryptedPayload.id });
    if (!group) return res.status(404).send({ error: "Group not found." });

    const newcomer = await User.findById({ _id: req.user._id });
    if (!newcomer) return res.status(400).send({ error: "User is not valid." });

    const currentMem = group.members.filter((member) =>
      member.member_id.equals(req.user._id)
    );
    if (currentMem.length > 0)
      return res.status(400).send({ error: "User is already a member." });

    try {
      group.members.push({
        member_id: req.user._id,
        member_name: req.user.name,
      });
      newcomer.groups.push({ groupName: group.name, groupId: group._id });
      await group.save();
      await newcomer.save();

      res.send(group);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
        res.status(500).send(ex.errors[field].message);
      }
    }
  })
);

module.exports = router;
