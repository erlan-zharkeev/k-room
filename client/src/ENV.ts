import { EnvVariables } from 'common-types'

declare const SERVER_PORT: string
declare const HOST: string
declare const IS_DEV: boolean
declare const MAX_RECONNECT_ATTEMPTS: number
declare const GOOGLE_CLIENT_ID: string
declare const FIREBASE_API_KEY: string
declare const FIREBASE_AUTH_DOMAIN: string
declare const FIREBASE_PROJECT_ID: string
declare const FIREBASE_STORAGE_BUCKET: string
declare const FIREBASE_MESSAGING_SENDER_ID: string
declare const FIREBASE_APP_ID: string
declare const FIREBASE_MEASUREMENT_ID: string

export default {
  SERVER_PORT,
  HOST,
  IS_DEV,
  MAX_RECONNECT_ATTEMPTS,
  GOOGLE_CLIENT_ID,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} as EnvVariables
