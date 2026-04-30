import fs from 'fs'
import path from 'path'

import dotenv, { type DotenvParseOutput } from 'dotenv'
import { formatAppName, IPackageData, type IEnvSharedVariables, type IEnvVariables } from 'global-shared'

const stage = process.env.NODE_ENV ?? 'development'
const envDir = path.resolve(process.cwd(), '..')

const envs = dotenv.config({ path: path.resolve(envDir, `.env.${stage}`) }).parsed as DotenvParseOutput | IEnvVariables
const sharedEnvs = dotenv.config({ path: path.resolve(envDir, '.env.shared') }).parsed as
  | DotenvParseOutput
  | IEnvSharedVariables

const {
  ACCESS_TOKEN_SECRET,
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  API_HOST: ENV_API_HOST,
  APP_HOST: ENV_APP_HOST,
  COOKIE_DOMAIN,
  EMAIL_CONFIRM_SECRET,
  FIREBASE_API_KEY,
  MONGO_ADMIN_HOST,
  MONGO_ADMIN_MONGODB_URL,
  MONGO_ADMIN_PASSWORD,
  MONGO_ADMIN_USERNAME,
  MONGO_HOST,
  REFRESH_TOKEN_SECRET,
  RESEND_API_KEY,
  SENTRY_ENABLED,
  SENTRY_ENVIRONMENT
} = envs

const {
  ADMIN_COOKIE,
  ADMIN_ROOT_PATH,
  API_PATH,
  CLIENT_PORT: ENV_CLIENT_PORT,
  SERVER_PORT: ENV_SERVER_PORT,
  SOCKET_PATH
} = sharedEnvs

const APP_HOST = process.env.APP_HOST ?? ENV_APP_HOST
const API_HOST = process.env.API_HOST ?? ENV_API_HOST
const CLIENT_PORT = process.env.CLIENT_PORT ?? ENV_CLIENT_PORT
const SERVER_PORT = process.env.SERVER_PORT ?? ENV_SERVER_PORT

const packageData = JSON.parse(fs.readFileSync(path.resolve(envDir, 'package.json'), 'utf-8')) as IPackageData

const isDev = stage !== 'production'
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'
const TURNSTILE_TEST_SECRET_KEY = '1x0000000000000000000000000000000AA'
const redisUrl = process.env.REDIS_URL ?? envs.REDIS_URL ?? (isDev ? 'redis://127.0.0.1:6379' : '')
const turnstileSiteKey =
  process.env.TURNSTILE_SITE_KEY ?? envs.TURNSTILE_SITE_KEY ?? (isDev ? TURNSTILE_TEST_SITE_KEY : '')
const turnstileSecretKey =
  process.env.TURNSTILE_SECRET_KEY ?? envs.TURNSTILE_SECRET_KEY ?? (isDev ? TURNSTILE_TEST_SECRET_KEY : '')
const clientUrl = isDev ? `${APP_HOST}:${CLIENT_PORT}` : APP_HOST
const devOrigins = [
  clientUrl,
  APP_HOST,
  `http://127.0.0.1:${CLIENT_PORT}`,
  `http://localhost:${CLIENT_PORT}`,
  `https://127.0.0.1:${CLIENT_PORT}`,
  `https://localhost:${CLIENT_PORT}`
]

export const SERVER_ENV = {
  stage,
  isDev,
  appHost: APP_HOST,
  apiHost: API_HOST,
  apiPath: API_PATH,
  socketPath: SOCKET_PATH,
  domain: isDev ? '' : COOKIE_DOMAIN,
  serverPort: Number(SERVER_PORT),
  clientPort: Number(CLIENT_PORT),
  serverUrl: isDev ? `${API_HOST}:${SERVER_PORT}${API_PATH}` : `${API_HOST}${API_PATH}`,
  clientUrl,
  origins: isDev ? devOrigins : [APP_HOST],
  secret: {
    accessTokenSecret: ACCESS_TOKEN_SECRET,
    emailConfirmSecret: EMAIL_CONFIRM_SECRET,
    refreshTokenSecret: REFRESH_TOKEN_SECRET,
    firebaseApiKey: FIREBASE_API_KEY,
    resendApiKey: RESEND_API_KEY
  },
  info: {
    appName: formatAppName(packageData.name),
    appVersion: packageData.version
  },
  mongo: {
    mongoHost: MONGO_HOST,
    mongoAdminHost: MONGO_ADMIN_HOST,
    mongoAdminMongoDbUrl: MONGO_ADMIN_MONGODB_URL,
    mongoAdminUsername: MONGO_ADMIN_USERNAME,
    mongoAdminPassword: MONGO_ADMIN_PASSWORD
  },
  adminjs: {
    adminRootPath: ADMIN_ROOT_PATH,
    adminLoginPath: `${ADMIN_ROOT_PATH}/login`,
    adminLogoutPath: `${ADMIN_ROOT_PATH}/logout`,
    adminCookie: ADMIN_COOKIE,
    adminUsername: ADMIN_USERNAME,
    adminPassword: ADMIN_PASSWORD
  },
  sentry: {
    sentryEnvironment: SENTRY_ENVIRONMENT,
    sentryEnabled: SENTRY_ENABLED === 'true'
  },
  security: {
    redisUrl,
    turnstileSiteKey,
    turnstileSecretKey
  }
} as const
