import fs from 'fs'
import path from 'path'

import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { type NextFunction, type Request, type Response } from 'express'

import { createAdminRouter, getAdminFaviconPath } from './app/adminjs'
import { AppExceptionFilter } from './app/app-exception.filter'
import { AppModule } from './app/app.module'
import { connectDatabase } from './app/connect-database'
import { SERVER_ENV } from './app/env'
import { initSentry, setupSentryErrorHandler } from './app/sentry'
import { initIO } from './app/socket'
import { errorToMessage } from './shared/lib/error-to-message'
import { getRequestLanguage } from './shared/lib/get-request-language'
import { log } from './shared/lib/log'
import { serverCaptureSentryException } from './shared/lib/sentry'

const bootstrap = async () => {
  initSentry()

  const app = await NestFactory.create(AppModule, {
    ...(SERVER_ENV.isDev
      ? {
          httpsOptions: {
            key: fs.readFileSync(path.resolve(__dirname, '../../dev-certs/k-room-dev-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../../dev-certs/k-room-dev.pem'))
          }
        }
      : {})
  })
  const expressApp = app.getHttpAdapter().getInstance()
  const adminFaviconPath = getAdminFaviconPath()

  app.enableCors({
    origin: SERVER_ENV.origins,
    credentials: true,
    optionsSuccessStatus: 200
  })
  expressApp.set('trust proxy', true)
  app.use(cookieParser())
  app.use((request: Request, _response: Response, next: NextFunction) => {
    request.language = getRequestLanguage(request.headers)
    next()
  })
  app.useGlobalFilters(new AppExceptionFilter())
  expressApp.get('/admin-favicon.svg', (_request: Request, response: Response) => {
    response.sendFile(adminFaviconPath)
  })
  app.setGlobalPrefix(SERVER_ENV.apiPath.replace(/^\/+|\/+$/g, ''), { exclude: ['health'] })

  await connectDatabase()
  app.use(SERVER_ENV.adminjs.adminRootPath, await createAdminRouter())
  setupSentryErrorHandler(expressApp)
  initIO(app.getHttpServer())

  await app.listen(SERVER_ENV.serverPort)
  log.success(`-Server listening on port ${SERVER_ENV.serverPort}`)
}

process.on('unhandledRejection', (error) => {
  log.error('-Unhandled rejection')
  log.error(`-${errorToMessage(error)}`)
  serverCaptureSentryException(error)
})

process.on('uncaughtException', (error) => {
  log.error('-Uncaught exception')
  log.error(`-${errorToMessage(error)}`)
  serverCaptureSentryException(error)
})

void bootstrap().catch((error) => {
  log.error('-Bootstrap failed')
  log.error(`-${errorToMessage(error)}`)
  serverCaptureSentryException(error)
  process.exit(1)
})
