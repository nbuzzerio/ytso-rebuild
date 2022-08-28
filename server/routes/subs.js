const express = require("express");
const mongoose = require("mongoose");
const { User, validate } = require("../../database/models/users");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);

    try {
      const { subs } = await User.findById(decoded._id).select("subs");
      res.send(subs);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
      }
    }
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);

    try {
      const user = await User.findById(decoded._id);
      user.subs.push(req.body);
      await user.save();

      res.send(user.subs);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
      }
    }
  })
);

router.delete(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);

    try {
      const user = await User.findById(decoded._id);
      user.subs = user.subs.filter((sub) => sub.channelId !== req.body.channelId);
      await user.save();

      res.send(user.subs);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
      }
    }
  })
);

module.exports = router;
