const express = require('express')
const User = require('../models/user')
const redis = require('../utils/database/redis')


const router = express.Router()


router.get('/', async (req, res, next) => {
    await redis.connect()
    const list = await redis.zRange('LeaderBoard', 0, 99, { REV: true })

    const users = []
    await Promise.all(
        list.map(async (x) => {
            const user = await User.findOne({ username: x }).exec()
            const currentRank = +(await redis.zRevRank(
                'LeaderBoard',
                user.username,
                
            ))
            const getADayAgoRank = +(await redis.zRevRank(
                'backupLeaderBoard',
                user.username
            ))
            const rankDif = getADayAgoRank ?  getADayAgoRank-currentRank : 0
            const updateUser = await User.findOneAndUpdate(
                { username: x },
                {rank : currentRank+1 ,  dailyDif: rankDif }
            )
            await updateUser.save()
            const userUpdated = await User.findOne({ username: x }).exec()

            users.push(userUpdated)
        })
    )
    await redis.quit()

    res.json({ users })
})

router.get('/user/:uid', async (req, res, next) => {
    const userId = req.params.uid
    await redis.connect()
    const user = await User.findById(userId).exec()
    const upperUser = (user.rank -1)- 3 <= 0 ? 0 : (user.rank -1)- 3
    const lowerUser = (user.rank -1) + 3 <6 ? 5 : (user.rank -1) + 3 

    const userNameList = await redis.zRange(
        'LeaderBoard',
        upperUser,
        lowerUser,
        { REV: true }
    )
    const users = []
    await Promise.all(
        userNameList.map(async (x) => {
            const user = await User.findOne({ username: x }).exec()
            const currentRank = +(await redis.zRevRank('LeaderBoard', x))
            const getADayAgoRank = +(await redis.zRevRank('backupLeaderBoard', x))
            const rankDif = getADayAgoRank ? getADayAgoRank-currentRank: 0
            const updateUser = await User.findOneAndUpdate(
                { username: x },
                {rank : currentRank+1 ,  dailyDif: rankDif }
            )
            await updateUser.save()
            const userUpdated = await User.findOne({ username: x })

            users.push(userUpdated)
        })
    )

    await redis.quit()
    const data = {
        user,
        users,
    }

    res.json(data)
})

module.exports = router
