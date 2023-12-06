const User = require("../models/userModel");
const Message = require("../models/msgModel");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
//passport stuff, etc
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

exports.feed = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.redirect("/users/login");
  }

  const user = await User.findById(req.user.id).exec();

  const feed = await Message.find({ votes: { $gt: 5 } })
    .sort({ date: -1 })
    .limit(10)
    .populate({
      path: "user",
      select: "uName",
    })
    .exec();

  let out, last;
  if (feed.length > 0) {
    last = feed[feed.length - 1].date;
    out = feed;
  } else {
    out = false;
  }

  res.render("homePage", {
    title: `Welcome back, ${user.uName}!`,
    msgFeed: out,
    //last: last,
  });
});

//voting
exports.voting = [
  body("content").escape(),
  body("vote").escape(),

  asyncHandler(async (req, res, next) => {
    if (req.body.vote === "up") {
      await Message.findByIdAndUpdate(req.body.msgID, { $inc: { votes: 1 } });
    } else {
      await Message.findByIdAndUpdate(req.body.msgID, { $inc: { votes: -1 } });
    }
    res.redirect("/");
  }),
];

//All users
exports.userList = asyncHandler(async (req, res, next) => {
  const users = await User.find(
    {},
    { uName: 1, votes: 1, status: 1, msgHistory: 1 }
  )
    .populate({
      path: "msgHistory",
      perDocumentLimit: 3,
      options: { sort: { date: -1 } },
    })
    .limit(15)
    .exec();

  const out = users.length < 1 ? false : users;

  res.render("userList", {
    title: "User List",
    users: out,
  });
});

//log out
exports.logout = (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

//log in
exports.loginGet = asyncHandler(async (req, res, next) => {
  res.render("loginForm", {
    title: `Log in below`,
  });
});

exports.loginPost = passport.authenticate("local", {
  successRedirect: `/users/`,
  failureRedirect: "/login",
});

//redirect
exports.userRedirect = (req, res, next) => {
  if (req.user) {
    res.redirect(`/users/auth/${req.user.id}`);
  } else {
    res.redirect("/login");
  }
};

//user profile - logged in
exports.userHome = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.status !== 0) {
    //session ID doesn't match, redirect to guest view
    res.redirect("/");
  } else {
    const user = await User.findById(req.params.id, { _password: 0 })
      .populate({
        path: "msgHistory",
        perDocumentLimit: 5,
        options: { sort: { date: -1 } },
      })
      .exec();

    if (!user) {
      //user from id param is not found (broken url?)
      res.redirect("/");
    }

    res.render("userHome", {
      title: `Welcome, ${user.uName}!`,
      user: user,
    });
  }
});

//view another user's info while logged in. Will copy this over to nonlogged in route i guess?
//actually guests cannot view users at all
exports.guestView = asyncHandler(async (req, res, next) => {
  const view = await User.findById(req.user.id, {
    uName: 1,
    msgHistory: 1,
    votes: 1,
  })
    .populate({
      path: "msgHistory",
      perDocumentLimit: 5,
      options: { sort: { date: -1 } },
    })
    .exec();

  if (!view) {
    //user not found from params, invalid URL?
    res.redirect("/users");
  }
  res.render("guestView", {
    title: `${view.uName}'s profile`,
    user: view,
  });
});

//post message, from a pinned window on all pages?
exports.msgPost = [
  body("content")
    .trim()
    .escape()
    .isLength({ max: 200 })
    .withMessage(`Must be under 200 characters`),

  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.redirect("/signup");
    }
    //const user = await User.findById(req.user.id).exec()

    //Do we want to validate? YES
    const message = new Message({
      user: req.user.id,
      content: req.body.content,
      date: new Date(),
      votes: 0,
    });

    await message.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { msgHistory: message._id },
    });

    res.redirect("/");
  }),
];

//upgrading status
exports.statusGet = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    //not logged in
    res.redirect("/login");

  const user = User.findById(req.user.id, { _password: 0 }).exec();

  if (!user) {
    //not found
    res.redirect('login')
  }
  
    res.render("upgradeStatus", {
      title: "Interested in upgrading your status? Review the options below",
      status: user.checkStatus,
    });
}});

exports.statusPost = [
  body("payment").isNumeric(),

  asyncHandler(async (req, res, next) => {

    const payCode = Number(req.body.payment);

    if (payCode) {
      await User.findByIdAndUpdate(req.user.id, { status: payCode });
      res.redirect(`/users/auth/${req.user.id}`);
    } else {
      res.redirect("/all");
    }

    // if (payCode === 0) {
    //   //become super
    //   await User.findByIdAndUpdate(req.user.id, { status: 0 });
    //   res.redirect(`/user/auth/${req.user.id}`);
    // } else if (payCode === 1) {
    //   //become premium
    //   await User.findByIdAndUpdate(req.user.id, { status: 1 });
    //   res.redirect(`/user/auth/${req.user.id}`);
    // } else if (payCode === -1) {
    //   await User.findByIdAndUpdate(req.user.id, { status: -1 });
    //   res.redirect(`/user/auth/${req.user.id}`);
    // } else {
    //   //pay failure?
    //   res.redirect("/all");
    // }
  }),
];
