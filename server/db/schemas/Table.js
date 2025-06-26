const {Schema} = require("mongoose");
const database = require("../index");

const Table = new Schema({
    name: {type: String, required: true},
    capacity: {type: Number, required: true},
    min: {type: Number, default: 0},
})

module.exports = database.model('tables', Table, 'tables')