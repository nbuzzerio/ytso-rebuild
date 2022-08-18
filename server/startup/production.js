const helmet = require("helmet");
const compression = require("compression");

module.exports = function (app) {
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "default-src": ["'self'", "'unsafe-inline'"],
        "script-src": ["'self'", "'unsafe-eval'"],
        "style-src": null,
      },
    })
  );
  app.use(compression());
};
