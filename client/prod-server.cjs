const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const http = require('http')
const ENV = dotenv.config({ path: '.env.production' }).parsed
const app = express()
app.use(express.static(path.join(__dirname + '/build/')))
const httpServer = http.createServer(app)
httpServer.listen(ENV.VITE_CLIENT_PORT)
const routes = [
  '/',
  '/app',
  '/app/',
  '/login',
  '/registration',
  '/wait-email-confirm',
  '/confirm-email',
  '/password-recovery',
  '/privacy-policy'
]
routes.forEach((route) => {
  app.get(route, (_, res) => res.sendFile(path.join(__dirname, './build/index.html')))
})
console.log(ENV.VITE_CLIENT_PORT)
