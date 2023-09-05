var createError = require('http-errors');
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
require('dotenv').config()
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const User = require('./models/userModel')
//const mongoDb = 
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//connect to db
const mongoDb = process.env.MONGODB
const mySecret = process.env.SECRET
mongoose.connect(mongoDb, {useUnifiedTopology: true, useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongo connection error'))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport and session setup
//should this be in userControl only?
app.use(session({
  secret: mySecret,
  resave: false,
  saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())


//auth
passport.use(
  new localStrategy(async(username, password, done) => {
    try {
      const user = await User.findOne({ uName: username }).exec()
      const match = await bcrypt.compare(password, user._password)
      if (!user) {
        return done(null, false, { message: 'Username incorrect/not found' })
      }
      if (!match) {
        return done(null, false, { message: 'Incorrect Password' })
      }
      return done(null, user)
    } catch(err) {
      return done(err)
    }
  })
)

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch(err) {
    done(err)
  }
})

//Make user accessible
app.use(function(req, res, next) {
  if (req.user) {
    res.locals.currentUser = req.user._id
    res.locals.currentUserStatus = req.user.status
  }
  next()
})


//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
