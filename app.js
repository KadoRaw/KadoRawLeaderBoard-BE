const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('./utils/database/mongodb')
const leaderboardRoutes = require('./routes/LeaderBoard-route')


const app = express()
const httpServer = createServer(app)
app.use(cors())
const io = new Server(httpServer,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
})
const serviceRoutes = require('./routes/service')(io)

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_NAME}.akwns.mongodb.net/users_test?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log('Connected.')
    })
    .catch(() => {
        console.log('Not Connected.')
    })

app.use(bodyParser.json())
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/service', serviceRoutes)

httpServer.listen(process.env.PORT || 5000)
