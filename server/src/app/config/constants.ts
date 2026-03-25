export const MAX_HTTP_BUFFER_SIZE = 10 * 1_000_000

export const MONGO_CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1
} as const
