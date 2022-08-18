const express = require("express");
require("./startup/config")();
const logger = require("./startup/logger");
require("../database/index")(logger);
require("./startup/validation")();

const server = express();
require("./startup/routes")(server);
require("./startup/production")(server);

const listener = server.listen(process.env.PORT || 3000, (err) => {
  if (err) throw err;
  logger.info(`> Ready on http://localhost:${process.env.PORT || 3000}`);
});

module.exports = listener;
