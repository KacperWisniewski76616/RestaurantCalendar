const Reservations = require('../db/schemas/Reservation')
const moment = require("moment");
const {Types} = require("mongoose")
const {ObjectId} = Types

const getAllAfterToday = async () => await Reservations.find({
    $or: [
        {date: {$gt: moment().format('YYYY-MM-DD')}},
        {
            $and: [
                {time: {$gte: moment().format('HH:mm')}}, {date: moment().format('YYYY-MM-DD')}]
        }]
})

const createNew = async (form) => {
    const exists = await Reservations.exists({date: form.date, time: form.time, table_id: form.table_id})

    if (exists)
        throw new Error('Stolik jest już zarezerwowany')

    const record = new Reservations(form)
    await record.save()

    return record
}

const deleteReservation = async (id) => {
    const res = await Reservations.findById(id)
    console.log(res, id)
    if (!res) throw new Error('Nie znaleziono rezerwacji do usunięcia')

    await Reservations.findByIdAndDelete(id)
}

const updateReservation = async (id, form) => {
    const res = await Reservations.findById(id)

    if (!res) throw new Error('Nie znaleziono rezerwacji do edycji')

    const exists = await Reservations.exists({
        date: form.date,
        time: form.time,
        table_id: form.table_id,
        _id: {$ne: new ObjectId(id)}
    })

    if (exists)
        throw new Error('Stolik jest już zarezerwowany')

    await Reservations.findByIdAndUpdate(id, form)
}

module.exports = {
    getAllAfterToday,
    createNew,
    deleteReservation,
    updateReservation,
}