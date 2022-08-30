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
      const { categories } = await User.findById(decoded._id).select(
        "categories"
      );
      res.send(categories);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
      }
    }
  })
);
router.get(
  "/subs",
  auth,
  asyncMiddleware(async (req, res) => {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);

    try {
      const { categories } = await User.findById(decoded._id).select(
        "categories"
      );
      const category = categories.filter((category) =>
        category._id.equals(req.query.id)
      );

      res.send(category[0]);
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
      user.categories.push({
        categoryName: req.body.category,
        subs: [],
      });
      await user.save();

      res.send(user.categories);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
      }
    }
  })
);

router.put(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);

    try {
      const user = await User.findById(decoded._id);

      const category = user.categories.filter((category) =>
        category._id.equals(req.body.categoryId)
      );

      category[0].subs.push(req.body.sub);
      await user.save();

      res.send(category[0]);
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
      user.categories = user.categories.filter(
        (category) => category.categoryName !== req.body.categoryName
      );
      await user.save();
      res.send(user.categories);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
      }
    }
  })
);

router.delete(
  "/sub",
  auth,
  asyncMiddleware(async (req, res) => {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);

    try {
      const user = await User.findById(decoded._id);
      const category = user.categories.filter((category) =>
        category._id.equals(req.body.categoryId)
      );
      category[0].subs = category[0].subs.filter(
        (sub) => sub.channelId !== req.body.channelId
      );
      await user.save();
      res.send(category[0].subs);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
      }
    }
  })
);

module.exports = router;
