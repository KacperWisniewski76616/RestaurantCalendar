const User = require('../db/schemas/User')
const bcrypt = require('bcrypt')

const login = async (data) => {
    const user = await User.findOne({email: data.username}).lean()

    if (!user) throw new Error('User not found')
    const correctPass = await bcrypt.compare(data.pass, user.pass)
    if (correctPass) return user

    throw new Error('Wrong mail or password')
}

const getUsers = async () => await User.find()
module.exports = {
    login,
    getUsers
}