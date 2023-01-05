const express = require('express')
const path = require('path')
const dotenv = require('dotenv')

const ENV = dotenv.config({ path: './_env/.env.production' }).parsed
const app = express()

app.listen(ENV.CLIENT_PORT)

app.use(express.static(path.join(__dirname + '/bundle/')))

/** app.get(*) - doesn't work!!! */
const routes = ['/', '/app', '/app/', '/sign-in', '/sign-up', '/wait-email-confirm', '/confirm-email']
routes.forEach(route =>{
  app.get(route, (_, res) => res.sendFile(path.join(__dirname, './bundle/index.html')))
})