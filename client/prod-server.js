const express = require('express')
const path = require('path')
const dotenv = require('dotenv')

const ENV = dotenv.config({ path: `.env.production` }).parsed
const app = express()

app.listen(ENV.CLIENT_PORT)

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './bundle/index.html'))
})

app.use('/', express.static(path.join(__dirname, './bundle/')))

