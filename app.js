// Base App
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Routes
var routes = require('./routes/index');
var api = require('./routes/api');

// Database
var mongo = require('mongodb');
var monk = require('monk');

// Start our Express App
var app = express();

// var db = monk('legbot:legw0rk!@ds031792.mongolab.com:31792/heroku_app37057289');
console.log(process.env.NODE_ENV, process.env.MONGO_USER, process.env.MONGO_PW);

if(process.env.NODE_ENV == "development"){
  var db = monk('localhost:27017/leglights');
} else {
  var db = monk('ds031792.mongolab.com:31792/heroku_app37057289',{
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PW
  });
}

// Setup Websockets
var ws = require('nodejs-websocket');
var port = 8000;
var connections = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create the websocket server, provide connection callback
var ws_server = ws.createServer(function (conn) {

  // Push the connection into the connections array
  connections.push(conn);

  // Set the apps connections
  app.set('connections', connections);

}).listen(port);

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// Set the routes
app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


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
