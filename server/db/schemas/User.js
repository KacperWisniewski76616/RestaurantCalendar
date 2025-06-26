const {Schema} = require("mongoose");
const database = require("../index");

const User = new Schema({
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    email: {type: String, required: true},
    pass: {type: String, required: true},
})

module.exports = database.model('users', User, 'users')