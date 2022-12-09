const express = require('express')
const path = require('path')
const dotenv = require('dotenv')

const ENV = dotenv.config({ path: `.env.production` }).parsed
const app = express()

console.log(ENV.CLIENT_PORT)

app.listen(ENV.CLIENT_PORT, function () {
  console.log('Example app listening on port ENV.CLIENT_PORT!\n');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './bundle/index.html'))
})

app.use('/', express.static(path.join(__dirname, './bundle/')))

