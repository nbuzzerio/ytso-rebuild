const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");
const groups = require("../routes/groups");
const search = require("../routes/search");
const subs = require("../routes/subs");
const categories = require("../routes/categories");
const error = require("../middleware/error");

module.exports = function (server) {
  server.use(express.json());
  server.use((req, res, next) => {
    res.set("Content-Security-Policy", "script-src 'self' 'unsafe-eval';");
    return next();
  });

  server.use("/api/auth", auth);
  server.use("/api/users", users);
  server.use("/api/groups", groups);
  server.use("/api/search", search);
  server.use("/api/subs", subs);
  server.use("/api/categories", categories);
  server.use(error);
};
