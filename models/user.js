const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    country: { type: String, required: true },
    Money: { type: Number, required: false },
    rank: { type: Number, required: false },
    weeklyEarnedMoney: { type: Number, required: false },
    dailyDif: { type: Number, required: false },
})

module.exports = mongoose.model('User', userSchema)
