import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import https from 'https'
import methodOverride from 'method-override'

import { RouteNamesEnum } from 'common'

import { corsOptions, httpsOptions, setupSentryErrorHandler } from 'app/config'
import { initDataBase } from 'app/services/database'
import { rootRouter } from 'app/services/router'
import { initIO } from 'app/services/socket'

import { ENV } from 'shared-config'
import { log, serverCaptureSentryException, setIO } from 'shared-lib'
import { attachRequestLanguage } from 'shared-middleware'

const app = express()

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(attachRequestLanguage)
app.use(RouteNamesEnum.Api, rootRouter)
setupSentryErrorHandler(app)

const server = https.createServer(httpsOptions, app)

const run = async () => {
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

run().catch((error) => {
  log.error('-Server startup failed')
  log.error(String(error))
  serverCaptureSentryException(error)
})
