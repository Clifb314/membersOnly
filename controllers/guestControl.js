const User = require("../models/userModel");
const Message = require("../models/msgModel");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
//passport stuff, etc
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');

exports.home = async function (req, res, next) {
  if (req.user) {
    res.redirect('/users')
  }


  const feed = await Message.find(
    { votes: { $gt: 5 } },
    { user: 0, votes: 0 }
  )
    .sort({ date: -1 })
    .limit(10)
    .exec();
  let out
  if (feed.length > 0) {
    const last = feed[feed.length - 1].date;
    out = feed
  } else {
    out = false
  }


  res.render("homePage", {
    title: 'Welcome, guest!',
    msgFeed: out,
  });
};

exports.signUp = asyncHandler(async (req, res, next) => {
  res.render("signUpForm", {
    title: `Sign up to be a member!`,
  });
});

exports.signUpPost = [
  //body().trim(),
  body("uName")
    .isAlphanumeric()
    .withMessage(`No Special Characters in username`)
    .toLowerCase()
    .escape(),
  body("email").isEmail(),
  body("fName")
    .isAlpha()
    .withMessage("No special characters in first name")
    .toLowerCase()
    .escape(),
  body("lName")
    .isAlpha()
    .withMessage(`No special characters in last name`)
    .toLowerCase()
    .escape(),
  body("password")
    .escape()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Please review password requirements"),
  body('passwordCheck').escape(),
  // body("passwordCheck")
  //   .custom((value, { req }) => value === req.body.password)
  //   .withMessage(`Passwords didn't match`),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorOut = errors.array();
      res.render("signupForm", {
        title: `Sign up to be a member! - Please review for errors`,
        errors: true,
        errorList: errorOut,
      });
    } else {
      const check = await User.findOne({ uName: req.body.uName }).exec();
      if (check) {
        const errorOut = [{ msg: `Username is taken`, path: "uName" }];
        res.render("signupForm", {
          title: `Sign up to be a member! - Please review for errors`,
          errors: true,
          errorList: errorOut,
        });
      } else {
        const { uName, fName, lName, email, password } = req.body;

        bcrypt.hash(password, 10, async function(err, pw) {
          if (err) {
            return next(err)
          } else {
            const newUser = new User({
              uName: uName,
              fName: fName,
              lName: lName,
              _password: pw,
              email: email,
              votes: 0,
              msgHistory: [],
              status: -1,
            });
            await newUser.save()
            res.redirect(`/users/login/`);
          }
        });
      }
    }
  }),
];

//add log in fxns? or keep everything in /users?
// exports.signUpGet = asyncHandler(async (req, res, next) => {
//     res.render('signupForm', {
//         title: `Sign up to be a member!`
//     })

// })

// exports.signUpPost = [
//     body().trim(),
//     body('uName').isAlphanumeric().withMessage(`No Special Characters`).toLowerCase().escape(),
//     body('email').isEmail(),
//     body('fName').isAlpha().withMessage('No special characters').toLowerCase().escape(),
//     body('lName').isAlpha().withMessage(`No special characters`).toLowerCase().escape(),
//     body('password').isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}).withMessage('Please review password requirements'),

//     asyncHandler(async (req, res, next) => {

//         const errors = validationResult(req)

//         if (!errors.isEmpty()) {
//             const errorOut = errors.array()
//             res.render('signupForm', {
//                 title: `Sign up to be a member! - Please review for errors`,
//                 errors: true,
//                 errorList: errorOut,
//             })
//         } else {
//             const check = await User.findOne({ uName: req.body.uName }).exec()
//             if (check) {
//                 const errorOut = [{msg: `Username is taken`, path: 'uName'}]
//                 res.render('signupForm', {
//                     title: `Sign up to be a member! - Please review for errors`,
//                     errors: true,
//                     errorList: errorOut,
//                 })
//             } else {
//                 const { uName, fName, lName, email, password } = req.body
//                 const newUser = new User({
//                     uName: uName,
//                     fName: fName,
//                     lName: lName,
//                     _password: password,
//                     email: email,
//                     votes: 0,
//                     msgHistory: [],
//                     status: -1,
//                 })
//                 await newUser.save()
//                 res.redirect(`/users/login`)
//             }
//         }
// })]
