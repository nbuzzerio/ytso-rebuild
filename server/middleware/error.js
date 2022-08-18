const logger = require("../startup/logger");

module.exports = function (err, req, res, next) {
  const { message, stack } = err;

  logger.error(err.message, {
    name: "Api error",
    stack,
    msg: message,
  });

  res.status(500).send(err.message);
};
