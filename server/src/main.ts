import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'
import { SERVER_ENV } from './app/config/env'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: SERVER_ENV.origins })

  await app.listen(SERVER_ENV.serverPort)
}

void bootstrap()
