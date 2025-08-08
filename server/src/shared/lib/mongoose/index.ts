import mongoose from 'mongoose'
import { ENV } from 'shared-config'
import { log } from 'shared-lib'

mongoose.set('strictQuery', true)

export const initDataBase = async () => {
  try {
    await mongoose.connect(ENV.MONGO_HOST)
    log.success('-Connected to DB')
  } catch (e) {
    log.error('-Init DB failed')
    log.error(String(e))
  }
}
