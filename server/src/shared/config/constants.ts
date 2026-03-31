import type { IEnvVariables } from 'common'
import dotenv, { type DotenvParseOutput } from 'dotenv'

import { IServerEnv } from './types'

const stage = process.env.NODE_ENV ?? 'development'
const envs = dotenv.config({ path: `../.env.${stage}` }).parsed as DotenvParseOutput | IEnvVariables

const {
  K_ROOM_ACCESS_TOKEN_SECRET,
  EMAIL_CONFIRM_SECRET,
  K_ROOM_REFRESH_TOKEN_SECRET,
  RESEND_API_KEY,
  SENTRY_ENVIRONMENT,
  SENTRY_ENABLED,
  APP_HOST,
  API_HOST,
  SERVER_PORT,
  CLIENT_PORT,
  MONGO_HOST,
  COOKIE_DOMAIN
} = envs

const isDev = process.env.NODE_ENV === 'development'

export const SERVER_ENV: IServerEnv = {
  isDev,
  domain: isDev ? '' : COOKIE_DOMAIN,
  mongoHost: MONGO_HOST,
  serverPort: Number(SERVER_PORT),
  clientPort: Number(CLIENT_PORT),
  serverUrl: isDev ? `${API_HOST}:${SERVER_PORT}/api` : `${API_HOST}/api`,
  clientUrl: isDev ? `${APP_HOST}:${CLIENT_PORT}` : `${APP_HOST}`,
  accessTokenSecret: K_ROOM_ACCESS_TOKEN_SECRET,
  emailConfirmSecret: EMAIL_CONFIRM_SECRET,
  refreshTokenSecret: K_ROOM_REFRESH_TOKEN_SECRET,
  resendApiKey: RESEND_API_KEY,
  sentryEnvironment: SENTRY_ENVIRONMENT,
  sentryEnabled: SENTRY_ENABLED === 'true'
}

const host = new URL(APP_HOST)
const appHostnames = [host.hostname, `www.${host.hostname}`]

export const ORIGINS = appHostnames.flatMap((hostname) => [`https://${hostname}`, `http://${hostname}`])
