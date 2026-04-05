import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import https from 'https'
import methodOverride from 'method-override'
import path from 'path'

import { corsOptions, httpsOptions, setupSentryErrorHandler } from 'src/app/config'

import { SERVER_ENV } from 'src/shared/config'
import { log, serverCaptureSentryException, setIO } from 'src/shared/lib'
import { httpRequestLanguageMiddleware } from 'src/shared/middleware'

import { createAdminRouter } from './admin'
import { initDataBase } from './database'
import { rootRouter } from './router'
import { initIO } from './socket'

const app = express()
const adminFaviconPath = path.resolve(process.cwd(), 'public/admin-favicon.svg')

app.use(cors(corsOptions))
app.use(cookieParser())
app.get('/admin-favicon.svg', (_req, res) => {
  res.sendFile(adminFaviconPath)
})
app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true })
})
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(httpRequestLanguageMiddleware)
app.use(SERVER_ENV.apiPath, rootRouter)
setupSentryErrorHandler(app)

const server = SERVER_ENV.isDev ? https.createServer(httpsOptions, app) : http.createServer(app)

export const runServer = async () => {
  const isDatabaseInitialized = await initDataBase()

  if (!isDatabaseInitialized) {
    throw new Error('Database initialization failed')
  }

  app.use(SERVER_ENV.adminRootPath, await createAdminRouter())

  const io = initIO(server)
  setIO(io)

  server.listen(SERVER_ENV.serverPort, () => {
    log.success(`-Server listening on port ${SERVER_ENV.serverPort}`)
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
