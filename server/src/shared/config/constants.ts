import type { IEnvVariables } from 'common'
import dotenv, { type DotenvParseOutput } from 'dotenv'

const stage = process.env.NODE_ENV ?? 'development'
const envs = dotenv.config({ path: `../.env.${stage}` }).parsed as DotenvParseOutput | IEnvVariables

const requireServerEnv = (key: string, value?: string) => {
  if (!value) {
    throw new Error(`[server] Missing required env "${key}" in .env.${stage}`)
  }

  return value
}

envs.IS_DEV = process.env.NODE_ENV === 'development'
envs.SERVER_ASSETS_PATH = envs.IS_DEV ? './src/assets/' : './build/assets/'
envs.SERVER_URL = envs.IS_DEV ? `${envs.API_HOST}:${envs.SERVER_PORT}/api` : `${envs.API_HOST}/api`
envs.CLIENT_URL = envs.IS_DEV ? `${envs.APP_HOST}:${envs.CLIENT_PORT}` : `${envs.APP_HOST}`
const {
  K_ROOM_ACCESS_TOKEN_SECRET,
  EMAIL_CONFIRM_SECRET,
  K_ROOM_REFRESH_TOKEN_SECRET,
  RESEND_API_KEY,
  SENTRY_DSN_SERVER,
  SENTRY_ENVIRONMENT,
  SENTRY_ENABLED
} = process.env

export const ENV = {
  ...envs,
  K_ROOM_ACCESS_TOKEN_SECRET,
  EMAIL_CONFIRM_SECRET: requireServerEnv('EMAIL_CONFIRM_SECRET', EMAIL_CONFIRM_SECRET),
  K_ROOM_REFRESH_TOKEN_SECRET,
  RESEND_API_KEY: requireServerEnv('RESEND_API_KEY', RESEND_API_KEY),
  SENTRY_DSN_SERVER: requireServerEnv('SENTRY_DSN_SERVER', SENTRY_DSN_SERVER),
  SENTRY_ENVIRONMENT,
  SENTRY_ENABLED
} as IEnvVariables

const host = new URL(ENV.APP_HOST)
const appHostnames = [host.hostname, `www.${host.hostname}`]

export const ORIGINS = appHostnames.flatMap((hostname) => [`https://${hostname}`, `http://${hostname}`])

export const SEARCH_CONTACT_RESULT_LIMIT = 10
