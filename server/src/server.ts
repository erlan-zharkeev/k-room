import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import router from './router'
import ENV from './ENV'
import constants from './constants'
import { RouteNames } from './../../types'

const fs = require('fs')
const path = require('path')
const http = require('http')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const clc = require('cli-color')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(RouteNames.API, router)

app.get(RouteNames.API, (req: Request, res: Response) => {
  res.send('Server running')
})

const server = http.createServer(app)

const PORT = ENV.SERVER_PORT

server.listen(PORT, () => {
  console.log(clc.green.bgWhite(`-Server listening on port ${PORT}`))
})

// Create path for images
const imagesPath = 'assets/img/'
if (!fs.existsSync(path.join(__dirname, imagesPath))) fs.mkdir(path.join(__dirname, imagesPath))

export const io = new Server(server, {
  path: RouteNames.SOCKET,
  maxHttpBufferSize: constants.maxMbQuantityTransfer * 1000000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})
