import fs from 'fs'
import path from 'path'

import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { type NextFunction, type Request, type Response } from 'express'

import { AppModule } from './app/app.module'
import { SERVER_ENV } from './app/config/env'
import { connectDatabase } from './app/database/connect-database'
import { AppExceptionFilter } from './app/filters/app-exception.filter'
import { getRequestLanguage } from './shared/lib/get-request-language'

const bootstrap = async () => {
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

  app.enableCors({
    origin: SERVER_ENV.origins === '*' ? true : SERVER_ENV.origins,
    credentials: true,
    optionsSuccessStatus: 200
  })
  app.use(cookieParser())
  app.use((request: Request, _response: Response, next: NextFunction) => {
    request.language = getRequestLanguage(request.headers)
    next()
  })
  app.useGlobalFilters(new AppExceptionFilter())
  app.setGlobalPrefix(SERVER_ENV.apiPath.replace(/^\/+|\/+$/g, ''), { exclude: ['health'] })

  await connectDatabase()

  await app.listen(SERVER_ENV.serverPort)
}

void bootstrap()
