import mongoose from 'mongoose'

import { loadFixtures } from 'src/modules/fixtures/fixtures.service'
import { initMediaBuckets } from 'src/modules/media/media.service'
import { errorToMessage } from 'src/shared/lib/error-to-message'
import { log } from 'src/shared/lib/log'
import { serverCaptureSentryException } from 'src/shared/lib/sentry'

import { SERVER_ENV } from './env'

const MONGO_CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1
} as const

mongoose.set('strictQuery', true)

let mongoListenersInitialized = false

const initMongoConnectionListeners = () => {
  if (mongoListenersInitialized) {
    return
  }

  mongoListenersInitialized = true

  mongoose.connection.on('connecting', () => {
    log.info('-Mongo connecting')
  })
  mongoose.connection.on('connected', () => {
    log.success('-Mongo connected')
  })
  mongoose.connection.on('open', () => {
    log.success('-Mongo connection opened')
  })
  mongoose.connection.on('disconnected', () => {
    log.warn('-Mongo disconnected')
  })
  mongoose.connection.on('reconnected', () => {
    log.success('-Mongo reconnected')
  })
  mongoose.connection.on('error', (error) => {
    log.error('-Mongo connection error')
    log.error(`-${errorToMessage(error)}`)
    serverCaptureSentryException(error)
  })
}

export const connectDatabase = async () => {
  initMongoConnectionListeners()

  await mongoose.connect(SERVER_ENV.mongo.mongoHost, MONGO_CONNECTION_OPTIONS)
  log.success('-Connected to DB')

  try {
    initMediaBuckets()

    if (SERVER_ENV.isDev) {
      await loadFixtures()
    }
  } catch (error) {
    log.error('-Post-DB init failed')
    log.error(`-${errorToMessage(error)}`)
    serverCaptureSentryException(error)
  }
}
