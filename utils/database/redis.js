const Redis = require('redis')

const redis = Redis.createClient({
    url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASS}@redis-10337.c250.eu-central-1-1.ec2.cloud.redislabs.com:10337`,
})

module.exports = redis
