import express from 'express'
import { Server } from 'socket.io'
// const https = require('https')
const http = require('http')
import cors from 'cors'
import router from './router'
import ENV from './ENV'
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

// const fs = require('fs')
const options = {
  // key: fs.readFileSync('cert/key.pem'),
  // cert: fs.readFileSync('cert/cert.pem'),
  // ca: fs.readFileSync('cert/csr.pem'),
  // requestCert: true,
  // rejectUnauthorized: false,
  // strictSSL: false
}

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const clc = require('cli-color')

const PORT = ENV?.PORT ?? 3000

const app = express()

app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.use('/', router)

app.use(
  cors({
    origin: '*'
  })
)

const server = http.createServer(options, app)

server.listen(PORT, () => {
  console.log(clc.green.bgWhite(`-Server listening on port ${PORT}`))
})

app.get('/', (req: any, res: any) => {
  res.send('Server running!')
})

export const io = new Server(server, {
  path: '/app/'
})
