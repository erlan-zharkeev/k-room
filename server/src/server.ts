import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import router from './router'
import ENV from './ENV'
const http = require('http')
const https = require('https')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const clc = require('cli-color')
const cookieParser = require('cookie-parser')
import fs from 'fs'
import path from 'path'

const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use('/', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Server running')
})

const credentials ={
  key: fs.readFileSync(path.join(__dirname, 'certs/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs/cert.pem'))
}
// console.log(fs, path)
const server = ENV.IS_DEV ? http.createServer(app) : https.createServer(credentials, app)

const PORT = ENV.SERVER_PORT

server.listen(PORT, () => {
  console.log(clc.green.bgWhite(`-Server listening on port ${PORT}`))
})

export const io = new Server(server, {
  path: '/app/',
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})
