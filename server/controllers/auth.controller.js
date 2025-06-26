const User = require('../db/schemas/User')
const bcrypt = require('bcrypt')

const login = async (username, pass) => {
    const user = await User.findOne({mail: username}).lean()

    if(!user) throw new Error('User not found')

    if(bcrypt.compare(pass, user.pass)) return user

    throw new Error('Wrong mail or password')
}

module.exports = {
    login
}