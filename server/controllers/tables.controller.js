const Tables = require('../db/schemas/Table')

const getAll = async () => await Tables.find()

const createNew = async (form) => {
    const exists = await Tables.exists({name: form.name})

    if(exists)
        throw new Error('Stolik o takiej nazwie już istnieje')

    const record = new Tables(form)
    await record.save()

    return record
}

module.exports = {
    getAll,
    createNew,
}