var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/hdmbanking');

// users authentication
var usersAuth = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
    { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

var routes = require('./routes/index');
var customers = require('./routes/customers');
var supporters = require('./routes/supporters');
var bank = require('./routes/bank');
var refPersonalConditionCode = require('./routes/refpcc');
var savedRecipients = require('./routes/savedrep');
var accounts = require('./routes/accounts');
var refAccountTypeCode = require('./routes/refatc');
var refAccountStatusCode = require('./routes/refasc');
var transactions = require('./routes/transactions');
var refTransactionTypes = require('./routes/reftt');

function findByUsername(username, fn) {
  for (var i = 0, len = usersAuth.length; i < len; i++) {
    var user = usersAuth[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Use the BasicStrategy within Passport.
passport.use(new BasicStrategy({}, function(username, password, done) {

    // asynchronous verification, for effect...
    process.nextTick(function () {

      // Find the user by username.  If there is no user with the given username, or the password is not correct,
      // set the user to `false` to indicate failure.  Otherwise, return the authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.password != password) { return done(null, false); }
        return done(null, user);
      })
    });
  }
));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
// make the Database accessible to our router
app.use(function(req, res, next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/customers', customers);
app.use('/supporters', supporters);
app.use('/bank', bank);
app.use('/refpcc', refPersonalConditionCode);
app.use('/savedrep', savedRecipients);
app.use('/accounts', accounts);
app.use('/refatc', refAccountTypeCode);
app.use('/refasc', refAccountStatusCode);
app.use('/transactions', transactions);
app.use('/reftt', refTransactionTypes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
