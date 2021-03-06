/**
 * Module dependencies
 */

var stack = require('..');

/**
 * Expose the app
 */

var app = module.exports = stack();

app.configure(function() {

  // Test the req.metric
  app.useBefore('router', function metricsTest(req, res, next) {
    req.metric('testing', 123);
    next();
  });

  // Test the connect-base
  app.useBefore('router', function baseTest(req, res, next) {
    res.set('x-base', req.base);
    next();
  });

});

/**
 * Routes
 */

app.get('/', function(req, res, next){
  res.send('it works');
});

app.get('/error', function(req, res, next){
  var err = new Error('A wild error appears!');
  err.status = 501;
  next(err);
});
