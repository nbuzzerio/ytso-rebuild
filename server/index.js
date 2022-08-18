const next = require("next");
const express = require("express");
require("./startup/config")();
const logger = require("./startup/logger");
require("../database/index")(logger);
require("./startup/validation")();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const { parse } = require("url");

let listener;

app.prepare().then(() => {
  const server = express();
  require("./startup/routes")(server);
  require("./startup/production")(server);
  if (!dev) require("./startup/rateLimiter")(server);
  

  server.get("*", (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  listener = server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    logger.info(`> Ready on http://localhost:${process.env.PORT || 3000}`);
  });
});

module.exports = listener;