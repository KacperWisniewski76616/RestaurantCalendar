const User = require('../db/schemas/User')
const bcrypt = require('bcrypt')
const fs = require("fs");

const jsonFilePath = './calendar-app.users.json';

const login = async (data) => {
    const user = await User.findOne({email: data.username}).lean()

    if (!user) throw new Error('User not found')
    const correctPass = await bcrypt.compare(data.pass, user.pass)
    if (correctPass) return user

    throw new Error('Wrong mail or password')
}

const initUsers = async () => {
    const users = await User.find()

    const fileData = fs.readFileSync(jsonFilePath, 'utf8');
    const dataToInsert = JSON.parse(fileData);

    for(const user of dataToInsert) {
        if(!users.some(u => user.email === u.email)) {
            const record = await User(user)
            await record.save()
        }
    }
}

const getUsers = async () => await User.find()

module.exports = {
    login,
    getUsers,
    initUsers
}