const Reservations = require('../db/schemas/Reservation')
const moment = require("moment");

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

module.exports = {
    getAllAfterToday,
    createNew
}