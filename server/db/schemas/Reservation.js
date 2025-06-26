const {Schema} = require("mongoose");
const database = require("../index");

const Reservation = new Schema({
    user: {type: String, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    desc: {type: String, default: ''},
    guests: {type: Number, required: true},
    table_id: {type: String, required: true}
})

module.exports = database.model('reservations', Reservation, 'reservations')