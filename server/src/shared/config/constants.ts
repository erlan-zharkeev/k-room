import dotenv, { DotenvParseOutput } from 'dotenv'
import fs from 'fs'
import path from 'path'

import { IEnvCommonVariables, IEnvVariables } from 'common'

import { IServerEnv } from './types'

const stage = process.env.NODE_ENV ?? 'development'
const envs = dotenv.config({ path: `../.env.${stage}` }).parsed as DotenvParseOutput | IEnvVariables
const commonEnvs = dotenv.config({ path: `../.env.common` }).parsed as DotenvParseOutput | IEnvCommonVariables

const {
  K_ROOM_ACCESS_TOKEN_SECRET,
  EMAIL_CONFIRM_SECRET,
  K_ROOM_REFRESH_TOKEN_SECRET,
  RESEND_API_KEY,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  SENTRY_ENVIRONMENT,
  SENTRY_ENABLED,
  APP_HOST,
  API_HOST,
  MONGO_HOST,
  COOKIE_DOMAIN
} = envs

const { SERVER_PORT, CLIENT_PORT, SOCKET_PATH, API_PATH, ADMIN_ROOT_PATH, ADMIN_COOKIE } = commonEnvs

const isDev = process.env.NODE_ENV === 'development'
const { version: APP_VERSION } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../../package.json'), 'utf-8')
) as { version: string }

export const SERVER_ENV: IServerEnv = {
  appVersion: APP_VERSION,
  isDev,
  apiPath: API_PATH,
  domain: isDev ? '' : COOKIE_DOMAIN,
  socketPath: SOCKET_PATH,
  mongoHost: MONGO_HOST,
  serverPort: Number(SERVER_PORT),
  clientPort: Number(CLIENT_PORT),
  serverUrl: isDev ? `${API_HOST}:${SERVER_PORT}${API_PATH}` : `${API_HOST}${API_PATH}`,
  clientUrl: isDev ? `${APP_HOST}:${CLIENT_PORT}` : `${APP_HOST}`,
  accessTokenSecret: K_ROOM_ACCESS_TOKEN_SECRET,
  emailConfirmSecret: EMAIL_CONFIRM_SECRET,
  refreshTokenSecret: K_ROOM_REFRESH_TOKEN_SECRET,
  resendApiKey: RESEND_API_KEY,
  adminUsername: ADMIN_USERNAME,
  adminPassword: ADMIN_PASSWORD,
  sentryEnvironment: SENTRY_ENVIRONMENT,
  sentryEnabled: SENTRY_ENABLED === 'true',
  adminRootPath: ADMIN_ROOT_PATH,
  adminLoginPath: `${ADMIN_ROOT_PATH}/login`,
  adminLogoutPath: `${ADMIN_ROOT_PATH}/logout`,
  adminCookie: ADMIN_COOKIE
}

const host = new URL(APP_HOST)
const appHostnames = [host.hostname, `www.${host.hostname}`]

export const ORIGINS = appHostnames.flatMap((hostname) => [`https://${hostname}`, `http://${hostname}`])
