require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/api.js');
var connectDB = require('./config/connectDB.js');
const passport = require('passport');
const passportConfig = require('./components/passport/passport.js');
var app = express();
const flash = require('connect-flash');

connectDB();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.set('layout', 'index');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));


app.use(session({
  secret: process.env.SECRET_KEY,

  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isAuthenticated();
  res.locals.user= req.user;
  next();
});
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.message = req.flash('message');
  next();
});

passportConfig(passport);

app.use(cors());
app.use(require('express-ejs-layouts'));




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', registerRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
