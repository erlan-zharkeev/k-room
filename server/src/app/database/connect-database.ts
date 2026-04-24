import mongoose from 'mongoose'

import { SERVER_ENV } from '../config/env'

const MONGO_CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1
} as const

mongoose.set('strictQuery', true)

export const connectDatabase = async () => {
  await mongoose.connect(SERVER_ENV.mongo.mongoHost, MONGO_CONNECTION_OPTIONS)
}
