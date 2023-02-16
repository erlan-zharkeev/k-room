const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
// const https = require('https')
const http = require('http')
const ENV = dotenv.config({ path: './_env/.env.production' }).parsed
const app = express()
const fs = require('fs')

app.use(express.static(path.join(__dirname + '/bundle/')))

// const credentials = {
//   key: fs.readFileSync(path.join(__dirname, './bundle/certs/key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, './bundle/certs/cert.pem'))
// }

const server = http.createServer(app)
server.listen(ENV.CLIENT_PORT)

const routes = ['/', '/app', '/app/', '/sign-in', '/sign-up', '/wait-email-confirm', '/confirm-email']
routes.forEach(route =>{
  app.get(route, (_, res) => res.sendFile(path.join(__dirname, './bundle/index.html')))
})