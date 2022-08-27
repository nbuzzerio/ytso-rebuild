const helmet = require("helmet");
const compression = require("compression");

module.exports = function (app) {
  // app.use(helmet());
  // app.use(
  //   helmet.contentSecurityPolicy({
  //     crossOriginEmbedderPolicy: false,
  //     directives: {
  //       "default-src": ["'self'", "'unsafe-inline'"],
  //       "script-src": ["'self'", "'unsafe-eval'"],
  //       "img-src": ["'self'", "https://yt3.ggpht.com"],
  //       "style-src": null,
  //     },
  //   })
  // );
  app.use(compression());
};
