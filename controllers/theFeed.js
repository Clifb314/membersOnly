const User = require('../models/userModel')
const Message = require('../models/msgModel')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')


exports.home = async function(res, req, next) {
    const feed = await Message.find({votes: { $gt: 5 }}).sort({date: -1}).limit(10).exec()

    res.render('homePage', {
        title: '',
        msgFeed: feed,
    })
}