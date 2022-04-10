const redis = require('../utils/database/redis')
const User = require('../models/user')

const updateUserAndPrize = async(value , userId) => {
    const user = await User.findById(userId)

    const existPrize = await redis.get('prize')
    const tax = +existPrize + +value * 0.02
    await redis.set('prize', `${tax}`)

    await redis.zIncrBy('LeaderBoard', value, `${user.username}`)
    
    return {user , tax};
}

const getTax = async (value, userId) => {
    try {
        redis.connect()
        const{user , tax} = await updateUserAndPrize(value, userId);
        
        const currentRank = await redis.zRevRank(
            'LeaderBoard',
            `${user.username}`
            )+1
            
        const getADayAgoRank = await redis.zRevRank(
            'backupLeaderBoard',
            `${user.username}`
        )+1
        const rankDif = getADayAgoRank ? getADayAgoRank- currentRank : 0

        await User.findByIdAndUpdate(
            { _id: userId },
            {
                weeklyEarnedMoney: user.weeklyEarnedMoney + value,
                Money: user.Money + value,
                rank: `${currentRank}`,
                dailyDif: `${rankDif}`,
            }
            )
            const userRank = await redis.zRevRank(
                'LeaderBoard',
                `${user.username}`
                )+1
            redis.disconnect();
        const result = {
            message: `Succeed. Collected Prize:${tax} from ${user.username} and user updated.`,
            
            userRank
        }

        return result
    } catch (error) {
        const result = { message: `Error. ${error}` }

        return result
    }

    

}

module.exports = getTax
