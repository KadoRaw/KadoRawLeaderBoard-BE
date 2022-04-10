const redis = require('../utils/database/redis')

const getBackUp = async () => {
    try {
        redis.connect()

        await redis.zUnionStore('backupLeaderBoard', 'LeaderBoard')

        redis.disconnect()

        console.log({ message: `Succeed. ${Date.now()}` })
    } catch (error) {
        console.log({ message: `Error. ${error}` })
    }
}

const backupDaily = () => {
    getBackUp()
    setInterval(() => {
        getBackUp()
    }, 60000 * 60 * 24)
}

module.exports = backupDaily
