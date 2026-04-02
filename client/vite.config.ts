import fs from 'fs'
import path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'

import { generatePWAConfig } from './vite.pwa.config'

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '..')
  const env = loadEnv(mode, envDir, '')
  const commonEnv = loadEnv('common', envDir, '')
  const isDev = mode === 'development'
  const { APP_HOST, API_HOST, SERVER_PORT, CLIENT_PORT, FIREBASE_API_KEY, SENTRY_ENVIRONMENT, SENTRY_ENABLED } = env
  const { SOCKET_PATH, API_PATH } = commonEnv
  const { name: APP_NAME, version: APP_VERSION } = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
  ) as { name: string; version: string }

  const CLIENT_ENV_DATA = {
    isDev,
    isE2E: process.env.E2E === 'true',
    socketPath: SOCKET_PATH,
    apiPath: API_PATH,
    appName: APP_NAME,
    appVersion: APP_VERSION,
    serverPort: Number(SERVER_PORT),
    clientPort: Number(CLIENT_PORT),
    appHost: APP_HOST,
    apiHost: API_HOST,
    firebaseApiKey: FIREBASE_API_KEY,
    sentryDsnClient: 'https://b10bd66a4f5c0bc565edbe0e0d5d9b02@o4511099405139968.ingest.us.sentry.io/4511099424997376',
    sentryEnvironment: SENTRY_ENVIRONMENT,
    sentryEnabled: SENTRY_ENABLED === 'true',
    socketBaseUrl: isDev ? `${APP_HOST}:${SERVER_PORT}` : API_HOST,
    apiBaseUrl: isDev ? API_PATH : `${API_HOST}${API_PATH}`,
    themeBg: '#1c1c1c', // DO NOT FORGET TO SYNC WITH theme.css
    themeAccent: '#418fde', // DO NOT FORGET TO SYNC WITH theme.css
    themeText: 'rgb(177 177 177 / 58.7%)', // DO NOT FORGET TO SYNC WITH theme.css
    supportEmail: ''
  }

  return {
    define: {
      CLIENT_ENV_DATA
    },
    envDir,
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api']
        }
      }
    },
    plugins: [
      {
        name: 'inject-theme-colors',
        transformIndexHtml: (html) => html.replaceAll('__THEME_BG__', CLIENT_ENV_DATA.themeBg)
      },
      nodePolyfills(),
      react(),
      svgr({}),
      !isDev && generatePWAConfig(CLIENT_ENV_DATA)
    ],
    optimizeDeps: {
      exclude: ['js-big-decimal']
    },
    build: {
      outDir: './build'
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src/shared/config/styles'),
        src: path.resolve(__dirname, './src'),
        common: path.resolve(__dirname, './../common')
      }
    },
    server: {
      historyApiFallback: true,
      port: Number(CLIENT_PORT),
      hmr: {
        host: new URL(APP_HOST).hostname
      },
      ...(isDev
        ? {
            https: {
              key: fs.readFileSync(path.resolve(__dirname, '../config/dev-certs/k-room-dev-key.pem')),
              cert: fs.readFileSync(path.resolve(__dirname, '../config/dev-certs/k-room-dev.pem'))
            }
          }
        : {}),
      proxy: {
        [CLIENT_ENV_DATA.apiBaseUrl]: {
          target: `${API_HOST}:${SERVER_PORT}`,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
