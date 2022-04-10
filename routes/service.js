const express = require('express')
const collectmoney = require('../service/PrizePoolCollecter')
const backupDaily = require('../service/backupDaily')
const resetWeekly = require('../service/resetWeekly')

const router = express.Router()


module.exports = (io) => {

    router.get('/runAll', (req, res, next) => {
        backupDaily()
        resetWeekly();
    })
       
    router.post('/collectmoney', async (req, res, next) => {
        const result = await collectmoney(req.body.value, req.body.userId)
        io.emit("resetdata", JSON.stringify(result.userRank));
        res.json(result)
    })
    return router;
}

