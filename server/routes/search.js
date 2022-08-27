const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");
require("dotenv").config();

const { google } = require("googleapis");

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const youtube = google.youtube("v3");

    youtube.search
      .list({
        auth: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: req.body.search,
        type: "channel",
      })
      .then((response) => {
        res.send(response.data.items);
      })
      .catch((err) => res.send(err));
  })
);

module.exports = router;
