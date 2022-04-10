# KadoRaw LeaderBoard Backend 
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) 

## Table of Content:

- [About The App](#about-the-app)
- [Technologies](#technologies)
- [Setup](#setup)
- [License](#license)

## About The App
KadoRaw LeaderBoard is an app that a leaderboard system for a game which has 10.000.000
active players. The leaderboard resets each week. Once the leaderboard resets, the top 100 players reset rewarded with in-game money according to their rankings and everything starts over.

`.../api/leaderboard` gives you top hundred user.
`.../api/leaderboard/[userID]` gives you top hundred and 3 players above and 2 players below the player.

`.../service/runAll` run all services. (Weekly Reset and Daily-Backup).
`.../service/collectmoney` get data whit contains value and userId. Get money and update player datas.

## Technologies
I used `Node.JS`, `MongoDB`, `Redis` ,`Express.js` ,`Socket.io`

## Setup
- download or clone the repository
- run `npm install`
- run `npm start`
- Don't forget set your db settings.

## License

GNU GPLv3 license @ [KadoRaw](https://github.com/KadoRaw)