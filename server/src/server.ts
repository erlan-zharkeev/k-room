import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import router from './router'
import ENV from './ENV'
const http = require('http')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const clc = require('cli-color')

const app = express()

app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.use('/', router)

app.use(
  cors({
    origin: '*'
  })
)

const server = http.createServer(app)

const PORT = ENV.SERVER_PORT
server.listen(PORT, () => {
  console.log(clc.green.bgWhite(`-Server listening on port ${PORT}`))
})

app.get('/', (req: Request, res: Response) => {
  res.send('Server running')
})

export const io = new Server(server, {
  path: '/app/'
})
