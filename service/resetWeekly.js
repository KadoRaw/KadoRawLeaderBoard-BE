const redis = require('../utils/database/redis')
const User = require('../models/user')

const resetRedis = async () => {
    try {
        await redis.connect()

        const existPrize = await redis.get('prize')
        await redis.zUnionStore('backupLeaderBoard', 'LeaderBoard')

        await redis.set('prize', '0')
        console.log({ message: 'Prize reset successful.' })

        await redis.zRemRangeByRank('LeaderBoard', 0, -1)
        await redis.zRemRangeByRank('backupLeaderBoard', 0, -1)
        console.log({ message: 'LeaderBoard reset successful.' })

        redis.disconnect()
        return +existPrize
    } catch (error) {
        console.log(error)
    }
}

const topTheree = async (name, value, prize) => {
    const user = await User.findOne({ username: `${name}` })
    const updateUser = await User.findOneAndUpdate(
        { username: `${name}` },
        {
            Money: `${user.Money + Math.round(prize * value)}`,
            rank: 0,
            dailyDif: 0,
        }
    )
    await updateUser.save()
}

const prizeDistribute = async (prize) => {
    try {
        await redis.connect()
        const [first] = await redis.zRange('backupLeaderBoard', 0, 0, {
            REV: true,
        })
        const [second] = await redis.zRange('backupLeaderBoard', 1, 1, {
            REV: true,
        })
        const [third] = await redis.zRange('backupLeaderBoard', 2, 2, {
            REV: true,
        })
        const topHundredPersons = await redis.zRange(
            'backupLeaderBoard',
            3,
            99,
            {
                REV: true,
            }
        )

        topTheree(first, 0.2, prize)
        topTheree(second, 0.15, prize)
        topTheree(third, 0.1, prize)

        for await (const person of topHundredPersons) {
            const user = await User.findOne({ username: `${person}` })
            const updateUser = await User.findOneAndUpdate(
                { username: `${person}` },
                {
                    Money: `${user.Money + Math.round(prize * 0.017636)}`,
                    rank: 0,
                    dailyDif: 0,
                }
            )
            await updateUser.save()
        }

        const res = await User.updateMany({}, { rank: 0 ,dailyDif: 0 })

        await redis.disconnect()
        console.log({ message: 'Prize distribute is done!' })
    } catch (error) {
        console.log({ message: 'Prize distribute cannot complete!' })
    }
}

const resetWeekly = () => {
    const prize = resetRedis()
    prizeDistribute(prize)
    setInterval(() => {
        const prize = resetRedis()
        prizeDistribute(prize)
    }, 60000 * 60 * 24 * 7)
}

module.exports = resetWeekly
