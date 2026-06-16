import fs from 'fs'
import path from 'path'

import dotenv, { type DotenvParseOutput } from 'dotenv'
import { formatAppName, readEnv, readSecretEnv, type EnvKey, type PackageData } from 'global-shared'

const stage = process.env.NODE_ENV ?? 'development'
const envDir = path.resolve(process.cwd(), '..')

const envs = (dotenv.config({ path: path.resolve(envDir, `.env.${stage}`) }).parsed ?? {}) as DotenvParseOutput
const sharedEnvs = (dotenv.config({ path: path.resolve(envDir, '.env.shared') }).parsed ?? {}) as DotenvParseOutput
const secretEnvs = readSecretEnv(path.resolve(envDir, '.env.secret'), fs)
const getEnv = (key: EnvKey, source: DotenvParseOutput) =>
  readEnv(key, source, { runtimeEnv: process.env, secretEnv: secretEnvs })

const ACCESS_TOKEN_SECRET = getEnv('ACCESS_TOKEN_SECRET', envs)
const ADMIN_PASSWORD = getEnv('ADMIN_PASSWORD', envs)
const ADMIN_USERNAME = getEnv('ADMIN_USERNAME', envs)
const APP_HOST = getEnv('APP_HOST', envs)
const API_HOST = getEnv('API_HOST', envs)
const COOKIE_DOMAIN = getEnv('COOKIE_DOMAIN', envs)
const EMAIL_CONFIRM_SECRET = getEnv('EMAIL_CONFIRM_SECRET', envs)
const FIREBASE_API_KEY = getEnv('FIREBASE_API_KEY', envs)
const MONGO_ADMIN_HOST = getEnv('MONGO_ADMIN_HOST', envs)
const MONGO_ADMIN_MONGODB_URL = getEnv('MONGO_ADMIN_MONGODB_URL', envs)
const MONGO_ADMIN_PASSWORD = getEnv('MONGO_ADMIN_PASSWORD', envs)
const MONGO_ADMIN_USERNAME = getEnv('MONGO_ADMIN_USERNAME', envs)
const MONGO_HOST = getEnv('MONGO_HOST', envs)
const REFRESH_TOKEN_SECRET = getEnv('REFRESH_TOKEN_SECRET', envs)
const RESEND_API_KEY = getEnv('RESEND_API_KEY', envs)
const SENTRY_ENABLED = getEnv('SENTRY_ENABLED', envs)
const SENTRY_ENVIRONMENT = getEnv('SENTRY_ENVIRONMENT', envs)

const ADMIN_COOKIE = getEnv('ADMIN_COOKIE', sharedEnvs)
const ADMIN_ROOT_PATH = getEnv('ADMIN_ROOT_PATH', sharedEnvs)
const API_PATH = getEnv('API_PATH', sharedEnvs)
const CLIENT_PORT = getEnv('CLIENT_PORT', sharedEnvs)
const SERVER_PORT = getEnv('SERVER_PORT', sharedEnvs)
const SOCKET_PATH = getEnv('SOCKET_PATH', sharedEnvs)

const packageData = JSON.parse(fs.readFileSync(path.resolve(envDir, 'package.json'), 'utf-8')) as PackageData
const APP_NAME = getEnv('APP_NAME', sharedEnvs) || formatAppName(packageData.name)

const isDev = stage !== 'production'
const isE2E = process.env.SERVER_E2E === 'true'
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'
const TURNSTILE_TEST_SECRET_KEY = '1x0000000000000000000000000000000AA'
const redisUrl = getEnv('REDIS_URL', envs) || (isDev ? 'redis://127.0.0.1:6379' : '')
const turnstileSiteKey = getEnv('TURNSTILE_SITE_KEY', envs) || (isDev ? TURNSTILE_TEST_SITE_KEY : '')
const turnstileSecretKey = getEnv('TURNSTILE_SECRET_KEY', envs) || (isDev ? TURNSTILE_TEST_SECRET_KEY : '')
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
  isE2E,
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
    appName: APP_NAME,
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
