import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import router from './router'
import ENV from './ENV'
import constants from './constants'
import { RouteNames } from './../../types'
import cors from 'cors'

const fs = require('fs')
const path = require('path')
const http = require('http')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const clc = require('cli-color')
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
app.use(RouteNames.API, router)

app.get(RouteNames.API, (_: Request, res: Response) => {
  res.send('Server running')
})

const server = http.createServer(app)

const PORT = ENV.SERVER_PORT

server.listen(PORT, () => {
  console.log(clc.green.bgWhite(`-Server listening on port ${PORT}`))
})

const imagesPath = 'assets/img/'
if (!fs.existsSync(path.join(__dirname, imagesPath))) {
  fs.mkdir(path.join(__dirname, imagesPath), (err: any) => {
    console.log(clc.red.bgWhite('-Cant create image directory'))
  })
}

export const io = new Server(server, {
  path: RouteNames.SOCKET_PATH,
  maxHttpBufferSize: constants.maxMbQuantityTransfer * 1000000,
  cors: {
    origin: ENV.IS_DEV ? '*' : origins
  }
})
