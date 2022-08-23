const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");

const CONFIG = require("../../config/youtube.config");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const jwt = require("jsonwebtoken");

    const { google } = require("googleapis");
    res.send(google)
  })
);

module.exports = router;
