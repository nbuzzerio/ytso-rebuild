const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
require("dotenv").config();

const { google } = require("googleapis");

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const youtube = google.youtube("v3");

    youtube.search
      .list({
        auth: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: req.query.q,
        type: "channel",
        pageToken: req.query.nextPageToken,
      })
      .then((response) => {
        res.send({
          items: response.data.items,
          nextPageToken: response.data.nextPageToken,
        });
      })
      .catch((err) => res.send(err));
  })
);

module.exports = router;
