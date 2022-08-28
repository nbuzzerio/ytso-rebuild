const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");
require("dotenv").config();

const { google } = require("googleapis");

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const youtube = google.youtube("v3");
    console.log(req.query)
    youtube.search
      .list({
        auth: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: req.query.q,
        type: "channel",
        pageToken: req.query.nextPageToken,
      })
      .then((response) => {
        console.log('#############################', response.data)
        res.send({items: response.data.items, nextPageToken: response.data.nextPageToken});
      })
      .catch((err) => res.send(err));
  })
);

module.exports = router;
