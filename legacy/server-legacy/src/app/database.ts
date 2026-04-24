import mongoose from 'mongoose'

import { loadFixtures } from 'src/modules/fixtures'

import { SERVER_ENV } from 'src/shared/config'
import { log } from 'src/shared/lib/log'
import { serverCaptureSentryException } from 'src/shared/lib/sentry'

import { initMediaBuckets } from '../media/init-media-buckets'

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
  if (mongoListenersInitialized) return

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
    log.error(String(error))
    serverCaptureSentryException(error)
  })
}

export const initDataBase = async (): Promise<boolean> => {
  initMongoConnectionListeners()

  try {
    await mongoose.connect(SERVER_ENV.mongoHost, MONGO_CONNECTION_OPTIONS)
    log.success('-Connected to DB')

    try {
      initMediaBuckets()

      if (SERVER_ENV.isDev) {
        await loadFixtures()
      }
    } catch (error) {
      log.error('-Post-DB init failed')
      log.error(String(error))
      serverCaptureSentryException(error)
    }

    return true
  } catch (error) {
    log.error('-Init DB failed')
    log.error(String(error))
    serverCaptureSentryException(error)
    return false
  }
}
