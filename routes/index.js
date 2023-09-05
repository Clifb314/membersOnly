const express = require('express');
const guest = require('../controllers/guestControl')
const User = require('../models/userModel')
const router = express.Router();
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const userControl = require('../controllers/userControl')






/* GET home page. */

router.get('/', guest.home);
router.post('/', guest.signUp)

router.get('/signup', guest.signUp)
router.post('/signup', guest.signUpPost)






module.exports = router;
