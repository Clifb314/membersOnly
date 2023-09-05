const express = require('express');
const User = require('../models/userModel')
const router = express.Router();
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const userControl = require('../controllers/userControl')
const guestControl = require('../controllers/guestControl')


//passport setup
passport.use(
  new localStrategy(async(username, password, done) => {
    try {
      const user = await User.findOne({ uName: username }).exec()
      if (!user) {
        return done(null, false, { message: 'Username incorrect/not found' })
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect Password' })
      }
      return done(null, user)
    } catch(err) {
      return done(err)
    }
  })
)


//routes for signed in user

router.get('/', userControl.feed)
router.post('/', userControl.voting)


router.get('/all', userControl.userList);


router.use('/logout', userControl.logout)

//move to guest page?
router.get('/signup', guestControl.signUp)
//move


//msg post
router.post('/msgSubmit', userControl.msgPost)

//msg vote
router.post('/')


router.get('/login', userControl.loginGet)
router.post('/login', userControl.loginPost)




//View user info
router.get('/auth/', userControl.userRedirect)
router.get('/auth/:id', userControl.userHome)
router.get('/all/:id', userControl.guestView)

//membership upgrade
router.get('/upgrade', userControl.statusGet)
router.post('/upgrade', userControl.statusPost)


module.exports = router;
