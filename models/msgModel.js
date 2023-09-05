const mongoose = require('mongoose')
const Schema = mongoose.Schema

const msgSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'userModel', required: true},
    content: {type: String, required: true, default: ''},
    date: {type: Date, required: true, default: new Date()},
    votes: {type: Number, default: 0},
})

msgSchema.virtual('upVote').set(function() {
    this.votes += 1
})

msgSchema.virtual('downVote').set(function() {
    this.votes-= 1
})

msgSchema.virtual('easyDate').get(function() {
    return `${this.date.toLocaleString()}`
})

module.exports = mongoose.model('msgModel', msgSchema)