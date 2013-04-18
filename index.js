
/**
 * Module dependencies.
 */
var pns = require("pack-n-stack")
  , express = require("express")
  , connect = require("express/node_modules/connect");

/**
 * Expose the stack
 */
module.exports = exports = function(config) {
  if (!config) config = {};

  // Create an express/pack-n-stack app
  var pack = pns(express.createServer());

  /**
   * Stack
   */
  pack
    // Pre-router stack
    .use("/favicon.ico", require("empty-favicon")())
    .use(require("./lib/header")(config.deprecate)) // Forwards compatibility
    .use(require("connect-base")(config.base))
    .use(require("connect-metric")((config.metric||{}).context, (config.metric||{}).options))
    .use(express.methodOverride())
    .use(express.bodyParser())
    .use(require("./lib/header-logger")())
    .use("", "compress", express.compress())

    // Router
    .use("", "router", pack.router)

    // Post-router stack
    .use(require("./lib/error-logger")());

  /**
   * Configuration
   */
  pack
    .configure(function() {
      // Remove it for security
      pack.set("x-powered-by", false);
    })
    .configure("production", function() {

    })
    .configure("development", function() {
      pack.locals.pretty = true;
      // Log our requests
      pack.useBefore("base", express.logger('dev'));
    });

  return pack;
};

/**
 * Expose connect.middleware as obj.*
 */
exports.middleware = function(obj) {
  for (var key in connect.middleware) {
    Object.defineProperty(
        obj
      , key
      , Object.getOwnPropertyDescriptor(connect.middleware, key));
  }
};
exports.middleware(exports.middleware);
