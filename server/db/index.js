const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const url = process.env.DB_CONN

console.log(url)

if(!url)
    throw new Error('DB_CONN MISSING')

const database = mongoose.createConnection(url)

database.once("open", () => {
    if(!database.db) throw new Error('No DB init')
    else console.log('BD connected')
})

module.exports = database