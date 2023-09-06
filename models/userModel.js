const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    uName: {type: String, required: true},
    _password: {type: String, required: true},
    fName: {type: String, required: true},
    lName: {type: String, required: true},
    email: {type: String, required: true},
    msgHistory: [{type: Schema.Types.ObjectId, ref: 'msgModel'}],
    votes: {type: Number, default: 0},
    status: {type: Number, default: -1},
})

userSchema.virtual('fullName').get(function() {
    function fixCaps(name) {
        const output = name.charAt(0).toUpperCase() + name.slice(1)
        return output
    }
    const first = fixCaps(this.fName)
    const last = fixCaps(this.lName)

    return `${first} ${last}`
})

userSchema.virtual('checkStatus').get(function() {
    if (this.status === 0) {return `Super User`}
    else if (this.status > 1) {return `Member`}
    else {return `User - no privledges`}
})

userSchema.virtual('upVote').set(function() {
    this.votes += 1
})

userSchema.virtual('downVote').set(function() {
    this.votes -= 1
})

userSchema.virtual('url').get(function() {
    return `/users/${this._id}`
})

userSchema.virtual('quickLook').get(function() {
    const messages = this.msgHistory.length + 1
    avgVote = this.votes / messages
    const output = {
        name: this.uName,
        msgCount: messages,
        votes: avgVote,
    }
    return output

})

module.exports = mongoose.model('userModel', userSchema)