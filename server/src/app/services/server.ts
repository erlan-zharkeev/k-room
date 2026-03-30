import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import https from 'https'
import methodOverride from 'method-override'

import { RouteNamesEnum } from 'common'

import { corsOptions, httpsOptions, setupSentryErrorHandler } from 'src/app/config'

import { ENV } from 'src/shared/config'
import { log, serverCaptureSentryException, setIO } from 'src/shared/lib'
import { attachRequestLanguage } from 'src/shared/middleware'

import { initDataBase, initIO, rootRouter } from './index'

const app = express()

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(attachRequestLanguage)
app.use(RouteNamesEnum.Api, rootRouter)
setupSentryErrorHandler(app)

const server = ENV.IS_DEV ? https.createServer(httpsOptions, app) : http.createServer(app)

export const runServer = async () => {
  await initDataBase()
  const io = initIO(server)
  setIO(io)
  server.listen(ENV.SERVER_PORT, () => {
    log.success(`-Server listening on port ${ENV.SERVER_PORT}`)
  })
}

process.on('unhandledRejection', (error) => {
  log.error('-Unhandled rejection')
  log.error(String(error))
  serverCaptureSentryException(error)
})

process.on('uncaughtException', (error) => {
  log.error('-Uncaught exception')
  log.error(String(error))
  serverCaptureSentryException(error)
})
