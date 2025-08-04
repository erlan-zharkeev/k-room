import express, { Request, Response } from 'express'
import { RouteNamesEnum } from 'common-types'
import cors from 'cors'
import { log, setIO, SYSTEM_DATA } from 'shared/utils'
import { ENV, ORIGINS } from 'shared/config'
import { Server } from 'socket.io'
import { rootRouter } from '../router'

const fs = require('fs')
const path = require('path')
const https = require('https')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const corsOptions = {
  origin: ORIGINS,
  optionsSuccessStatus: 200,
  preflightContinue: true,
  credentials: true
}

const app = express()

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(RouteNamesEnum.Api, rootRouter)

app.get(RouteNamesEnum.Api, (_: Request, res: Response) => {
  res.send('Server running')
})

const options = ENV.IS_DEV
  ? {
      key: fs.readFileSync(path.join(__dirname, 'dev-certs', 'k-room-dev-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'dev-certs', 'k-room-dev.pem'))
    }
  : {}

export const server = https.createServer(options, app)

const PORT = ENV.SERVER_PORT

server.listen(PORT, () => {
  log.success(`-Server listening on port ${PORT}`)
})

const imagesPath = 'assets/img/'
if (!fs.existsSync(path.join(__dirname, imagesPath))) {
  fs.mkdir(path.join(__dirname, imagesPath), () => {
    log.error('-Cant create image directory')
  })
}

const io = new Server(server, {
  path: RouteNamesEnum.SocketPath,
  maxHttpBufferSize: SYSTEM_DATA.maxMbQuantityTransfer * 1_000_000,
  cors: {
    origin: ENV.IS_DEV ? '*' : ORIGINS
  }
})

setIO(io)
