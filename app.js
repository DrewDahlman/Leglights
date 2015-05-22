// Base App
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

// Routes
var routes = require('./routes/index'),
    api = require('./routes/api');

// Database
var mongo = require('mongodb'),
    monk = require('monk');

// Start our Express App
var app = express();

console.log(process.env.NODE_ENV);

if(process.env.NODE_ENV == "development"){
  var mongo_db = '192.168.59.103:27017/leglights_db_1';
} else {
  var mongo_db = '104.131.51.119:27017/leglights_db_1';
}

// Connect
var db = monk(mongo_db);

// Setup Websockets
var ws = require('nodejs-websocket'),
    port = 666,
    connections = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.set('connections', connections);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create the websocket server, provide connection callback
var ws_server = ws.createServer(function (conn) {
  // Say hello
  conn.sendText('Connected');

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
