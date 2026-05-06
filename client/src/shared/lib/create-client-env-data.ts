import fs from 'fs'
import path from 'path'

import { formatAppName, type IPackageData } from 'global-shared'
import { loadEnv } from 'vite'

import type { IClientEnv } from 'src/shared/model'

export const createClientEnvData = (mode: string, envDir: string): IClientEnv => {
  const sharedEnv = loadEnv('shared', envDir, '')
  const modeEnv = loadEnv(mode, envDir, '')
  const isE2E = mode === 'test'
  const isDev = mode === 'development' || isE2E
  const isTauriDev = process.env.npm_lifecycle_event === 'serve:tauri'
  const tauriDevHost = process.env.TAURI_DEV_HOST
  const clientPort = Number(process.env.CLIENT_PORT ?? sharedEnv.CLIENT_PORT)
  const serverPort = Number(process.env.SERVER_PORT ?? sharedEnv.SERVER_PORT)
  const appHost = process.env.APP_HOST ?? modeEnv.APP_HOST
  const apiHost = process.env.API_HOST ?? modeEnv.API_HOST
  const turnstileSiteKey =
    process.env.TURNSTILE_SITE_KEY ?? modeEnv.TURNSTILE_SITE_KEY ?? (isDev ? '1x00000000000000000000AA' : '')
  const themeBg = '#1c1c1c'
  const themeAccent = '#418fde'
  const themeText = '#ffffff'
  const packageData = JSON.parse(fs.readFileSync(path.resolve(envDir, 'package.json'), 'utf-8')) as IPackageData

  return {
    apiPath: sharedEnv.API_PATH,
    apiBaseUrl: isDev ? `${apiHost}:${serverPort}${sharedEnv.API_PATH}` : `${apiHost}${sharedEnv.API_PATH}`,
    socketPath: sharedEnv.SOCKET_PATH,
    isDev,
    isTauriDev,
    isE2E,
    tauriDevHost,
    appName: formatAppName(packageData.name),
    appVersion: packageData.version,
    supportEmail: sharedEnv.SUPPORT_EMAIL ?? '',
    socketBaseUrl: isDev ? `${apiHost}:${serverPort}` : apiHost,
    serverPort,
    clientPort,
    appHost,
    apiHost,
    firebaseApiKey: modeEnv.FIREBASE_API_KEY,
    turnstileSiteKey,
    sentryDsnClient: modeEnv.SENTRY_DSN_CLIENT ?? '',
    sentryEnvironment: modeEnv.SENTRY_ENVIRONMENT,
    sentryEnabled: modeEnv.SENTRY_ENABLED === 'true',
    themeBg,
    themeAccent,
    themeText
  }
}
