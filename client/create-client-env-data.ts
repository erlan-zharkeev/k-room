import fs from 'fs'
import path from 'path'

import { formatAppName, readEnv, readSecretEnv, type EnvKey, type PackageData } from 'global-shared'
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
  const turnstileSiteKey = getEnv('TURNSTILE_SITE_KEY', modeEnv) || (isDev ? '1x00000000000000000000AA' : '')
  const themeBg = '#1c1f21'
  const themeAccent = '#006cb6'
  const themeText = '#778288'
  const packageData = JSON.parse(fs.readFileSync(path.resolve(envDir, 'package.json'), 'utf-8')) as PackageData

  return {
    apiPath,
    apiBaseUrl: isDev ? `${apiHost}:${serverPort}${apiPath}` : `${apiHost}${apiPath}`,
    socketPath,
    isDev,
    isTauriDev,
    isE2E,
    tauriDevHost,
    appName: formatAppName(packageData.name),
    appVersion: packageData.version,
    supportEmail: getEnv('SUPPORT_EMAIL', sharedEnv),
    socketBaseUrl: isDev ? `${apiHost}:${serverPort}` : apiHost,
    serverPort,
    clientPort,
    appHost,
    apiHost,
    firebaseApiKey: getEnv('FIREBASE_API_KEY', modeEnv),
    turnstileSiteKey,
    sentryDsnClient: getEnv('SENTRY_DSN_CLIENT', modeEnv),
    sentryEnvironment: getEnv('SENTRY_ENVIRONMENT', modeEnv),
    sentryEnabled: getEnv('SENTRY_ENABLED', modeEnv) === 'true',
    themeBg,
    themeAccent,
    themeText
  }
}
