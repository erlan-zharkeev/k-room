import mongoose from 'mongoose'

import { MONGO_CONNECTION_OPTIONS } from 'src/app/config'

import { loadFixtures } from 'src/features/fixtures'

import { initMediaBuckets } from 'src/entities/media'

import { ENV } from 'src/shared/config'
import { log, serverCaptureSentryException } from 'src/shared/lib'

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
    await mongoose.connect(ENV.MONGO_HOST, MONGO_CONNECTION_OPTIONS)
    log.success('-Connected to DB')

    try {
      initMediaBuckets()

      if (ENV.IS_DEV) {
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
