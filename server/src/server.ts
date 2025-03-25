import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import { RouteNames } from './../../types'
import cors from 'cors'
import { serverConstants } from './server-constants'
import { ENV } from './ENV'
import { router } from './router'
import { clc } from './utils'

const fs = require('fs')
const path = require('path')
const https = require('https')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const origins = ['https://k-room.space', 'http://k-room.space']

const corsOptions = {
  origin: origins,
  optionsSuccessStatus: 200,
  preflightContinue: true,
  credentials: true
}

const app = express()

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(RouteNames.Api, router)

app.get(RouteNames.Api, (_: Request, res: Response) => {
  res.send('Server running')
})

const options = ENV.IS_DEV
  ? {
      key: fs.readFileSync(path.join(__dirname, 'dev-certs', 'k-room-dev-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'dev-certs', 'k-room-dev.pem'))
    }
  : {}

const server = https.createServer(options, app)

const PORT = ENV.SERVER_PORT

server.listen(PORT, () => {
  console.log(clc.green.bgWhite(`-Server listening on port ${PORT}`))
})

const imagesPath = 'assets/img/'
if (!fs.existsSync(path.join(__dirname, imagesPath))) {
  fs.mkdir(path.join(__dirname, imagesPath), (err: unknown) => {
    console.log(clc.red.bgWhite('-Cant create image directory'))
  })
}

export const io = new Server(server, {
  path: RouteNames.SocketPath,
  maxHttpBufferSize: serverConstants.maxMbQuantityTransfer * 1000000,
  cors: {
    origin: ENV.IS_DEV ? '*' : origins
  }
})
