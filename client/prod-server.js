const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const https = require('https')
const http = require('http')
const ENV = dotenv.config({ path: './_env/.env.production' }).parsed
const app = express()

app.use(express.static(path.join(__dirname + '/bundle/')))

const httpServer = http.createServer(app)
const httpsServer = https.createServer(app)

httpServer.listen(ENV.CLIENT_PORT)
httpsServer.listen(ENV.CLIENT_PORT)

const routes = ['/', '/app', '/app/', '/sign-in', '/sign-up', '/wait-email-confirm', '/confirm-email']
routes.forEach(route =>{
  app.get(route, (_, res) => res.sendFile(path.join(__dirname, './bundle/index.html')))
})