const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const https = require('https')
const ENV = dotenv.config({ path: './_env/.env.production' }).parsed
const app = express()

app.use(express.static(path.join(__dirname + '/bundle/')))

const privateKey = fs.readFileSync('/etc/letsencrypt/live/k-room.space/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/k-room.space/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/k-room.space/chain.pem', 'utf8')

const credentials = {
  key: privateKey,
	cert: certificate,
	ca: ca
}

const server = https.createServer(credentials, app)
server.listen(ENV.CLIENT_PORT)

const routes = ['/', '/app', '/app/', '/sign-in', '/sign-up', '/wait-email-confirm', '/confirm-email']
routes.forEach(route =>{
  app.get(route, (_, res) => res.sendFile(path.join(__dirname, './bundle/index.html')))
})