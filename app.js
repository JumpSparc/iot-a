// app.js
var express      = require('express');
var app          = express();
var path         = require('path');
var port         = process.env.PORT || 3000;

var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');


// routes
var routes       = require('./routes/index');

// socket 
var server       = require('http').createServer(app);
var io           = require('socket.io')(server);

// db
var dbConfig     = require('./config/db.js');
var mongoose     = require('mongoose');
// mongoose.connect(process.env.MONGOLAB_URI || dbConfig.url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log('connected to db!');
});

// Configuring Passport
var passport       = require('passport');
var expressSession = require('express-session');
var flash          = require('connect-flash');

app.use(expressSession({secret: 'rickdtrickJumpsparc'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/passport')(passport); // pass passport for configuration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

routes(app, io, passport);
app.use('/', routes);

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

server.listen(port, function(){
  console.log('Server start.');
});