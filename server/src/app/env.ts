import fs from 'fs'
import path from 'path'

import dotenv, { type DotenvParseOutput } from 'dotenv'
import { formatAppName, IPackageData, type IEnvCommonVariables, type IEnvVariables } from 'global-shared'

const stage = process.env.NODE_ENV ?? 'development'
const envDir = path.resolve(process.cwd(), '..')

const envs = dotenv.config({ path: path.resolve(envDir, `.env.${stage}`) }).parsed as DotenvParseOutput | IEnvVariables
const commonEnvs = dotenv.config({ path: path.resolve(envDir, '.env.common') }).parsed as
  | DotenvParseOutput
  | IEnvCommonVariables

const {
  ACCESS_TOKEN_SECRET,
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  API_HOST,
  APP_HOST,
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

const { ADMIN_COOKIE, ADMIN_ROOT_PATH, API_PATH, CLIENT_PORT, SERVER_PORT, SOCKET_PATH } = commonEnvs

const packageData = JSON.parse(fs.readFileSync(path.resolve(envDir, 'package.json'), 'utf-8')) as IPackageData

const isDev = stage !== 'production'
const clientUrl = isDev ? `${APP_HOST}:${CLIENT_PORT}` : APP_HOST
const devOrigins = [clientUrl, APP_HOST, `http://127.0.0.1:${CLIENT_PORT}`, `http://localhost:${CLIENT_PORT}`]

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
  }
} as const
