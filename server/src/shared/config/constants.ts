import type { IEnvVariables } from 'common-types'
import dotenv, { type DotenvParseOutput } from 'dotenv'

const envs = dotenv.config({ path: `../.env.${process.env.NODE_ENV}` }).parsed as DotenvParseOutput | IEnvVariables
envs.IS_DEV = process.env.NODE_ENV === 'development'
envs.SERVER_ASSETS_PATH = envs.IS_DEV ? './src/assets/' : './build/assets/'
envs.SERVER_URL = envs.IS_DEV ? `${envs.HOST}:${envs.SERVER_PORT}/api` : `${envs.HOST}/api`
envs.CLIENT_URL = envs.IS_DEV ? `${envs.HOST}:${envs.CLIENT_PORT}` : `${envs.HOST}`
const {
  K_ROOM_ACCESS_TOKEN_SECRET,
  EMAIL_CONFIRM_SECRET,
  K_ROOM_MAIL_PASS,
  K_ROOM_REFRESH_TOKEN_SECRET,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  RESEND_FROM_NAME,
  SENTRY_DSN_SERVER,
  SENTRY_ENVIRONMENT,
  SENTRY_RELEASE,
  SENTRY_ENABLED
} = process.env

export const ENV = {
  ...envs,
  K_ROOM_ACCESS_TOKEN_SECRET,
  EMAIL_CONFIRM_SECRET,
  K_ROOM_MAIL_PASS,
  K_ROOM_REFRESH_TOKEN_SECRET,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  RESEND_FROM_NAME,
  SENTRY_DSN_SERVER,
  SENTRY_ENVIRONMENT,
  SENTRY_RELEASE,
  SENTRY_ENABLED
} as IEnvVariables

const host = new URL(ENV.HOST)

export const ORIGINS = [`https://${host.hostname}`, `http://${host.hostname}`]

export const MAX_HTTP_BUFFER_SIZE_MB = 10

export const MONGO_CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1
} as const
