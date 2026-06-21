import fs from 'fs'
import path from 'path'

import { formatAppName, readEnv, readSecretEnv, SENTRY_DSN_CLIENT, type EnvKey, type PackageData } from 'global-shared'
import { loadEnv } from 'vite'

import type { ClientEnv } from './client-env.types'

export const createClientEnvData = (mode: string, envDir: string): ClientEnv => {
  const sharedEnv = loadEnv('shared', envDir, '')
  const modeEnv = loadEnv(mode, envDir, '')
  const secretEnv = readSecretEnv(path.resolve(envDir, '.env.secret'), fs)
  const getEnv = (key: EnvKey, source: Record<string, string>) =>
    readEnv(key, source, { runtimeEnv: process.env, secretEnv })
  const isE2E = mode === 'test'
  const isDev = mode === 'development' || isE2E
  const isTauriDev = process.env.npm_lifecycle_event === 'serve:tauri'
  const tauriDevHost = process.env.TAURI_DEV_HOST
  const clientPort = Number(getEnv('CLIENT_PORT', sharedEnv))
  const serverPort = Number(getEnv('SERVER_PORT', sharedEnv))
  const apiPath = getEnv('API_PATH', sharedEnv)
  const socketPath = getEnv('SOCKET_PATH', sharedEnv)
  const appHost = getEnv('APP_HOST', modeEnv)
  const apiHost = getEnv('API_HOST', modeEnv)
  const firebaseApiKey = getEnv('FIREBASE_API_KEY', modeEnv)
  const turnstileSiteKey = getEnv('TURNSTILE_SITE_KEY', modeEnv) || (isDev ? '1x00000000000000000000AA' : '')
  const themeBg = '#1c1f21'
  const themeAccent = '#006cb6'
  const themeText = '#778288'
  const rootPackageData = JSON.parse(fs.readFileSync(path.resolve(envDir, 'package.json'), 'utf-8')) as PackageData
  const clientPackageData = JSON.parse(
    fs.readFileSync(path.resolve(envDir, 'client/package.json'), 'utf-8')
  ) as PackageData
  const appName = getEnv('APP_NAME', sharedEnv) || formatAppName(rootPackageData.name)

  if (!isDev && !firebaseApiKey) {
    throw new Error('FIREBASE_API_KEY is required for production client builds')
  }

  return {
    apiPath,
    apiBaseUrl: isDev ? `${apiHost}:${serverPort}${apiPath}` : `${apiHost}${apiPath}`,
    socketPath,
    isDev,
    isTauriDev,
    isE2E,
    tauriDevHost,
    appName,
    appVersion: clientPackageData.version,
    supportEmail: getEnv('SUPPORT_EMAIL', sharedEnv),
    socketBaseUrl: isDev ? `${apiHost}:${serverPort}` : apiHost,
    serverPort,
    clientPort,
    appHost,
    apiHost,
    firebaseApiKey,
    turnstileSiteKey,
    sentryDsnClient: SENTRY_DSN_CLIENT,
    sentryEnvironment: getEnv('SENTRY_ENVIRONMENT', modeEnv),
    sentryEnabled: getEnv('SENTRY_ENABLED', modeEnv) === 'true',
    themeBg,
    themeAccent,
    themeText
  }
}
