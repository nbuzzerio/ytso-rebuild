const winston = require("winston");
require("winston-mongodb");

const db = process.env.NODE_ENV === "dev" ? process.env.testdb : process.env.db;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.metadata(),
    winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: "logs/error.log", level: "error" }),
      new winston.transports.File({ filename: "logs/combined.log" }),
      new winston.transports.MongoDB({
        db: db,
        level: "error",
        options: { useUnifiedTopology: true },
      }),
    ],
  });
  if (process.env.NODE_ENV !== "prod") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.align(),
          winston.format.printf(info => `${info.level} -- ${info.timestamp}:${info.message}`)
      ),
    })
  );
}
process.on("uncaughtException", (ex) => {
  const { message, stack } = ex;

  logger.error(ex.message, {
    name: "Uncaught exception",
    stack,
    msg: message,
  });
  process.exit(1);
});
process.on("unhandledRejection", async (ex) => {
  const { message, stack } = ex;

  logger.error(ex.message, {
    name: "Unhandled rejection",
    stack,
    msg: message,
  });
  process.exit(1);
});

module.exports = logger;
