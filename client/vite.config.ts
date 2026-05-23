import fs from 'fs'
import path from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import { createClientEnvData } from './create-client-env-data'
import { generatePWAConfig } from './vite.pwa.config'

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '..')
  const { TAURI_ENV_DEBUG, TAURI_ENV_PLATFORM } = process.env
  const clientEnvData = createClientEnvData(mode, envDir)

  const tauriBuildConfig = TAURI_ENV_PLATFORM
    ? ({
        target: TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
        minify: TAURI_ENV_DEBUG ? false : 'esbuild',
        sourcemap: Boolean(TAURI_ENV_DEBUG)
      } as const)
    : {}

  const httpsConfig =
    clientEnvData.isDev && !clientEnvData.isTauriDev
      ? {
          https: {
            key: fs.readFileSync(path.resolve(__dirname, '../dev-certs/k-room-dev-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../dev-certs/k-room-dev.pem'))
          }
        }
      : {}

  const hmr = (() => {
    if (clientEnvData.tauriDevHost) {
      return {
        protocol: 'ws',
        host: clientEnvData.tauriDevHost,
        port: clientEnvData.clientPort + 1
      }
    }

    if (clientEnvData.isTauriDev) {
      return undefined
    }

    return {
      host: new URL(clientEnvData.appHost).hostname
    }
  })()

  return {
    clearScreen: false,
    envDir,
    envPrefix: ['VITE_', 'TAURI_ENV_*'],
    define: {
      __CLIENT_ENV_DATA__: JSON.stringify(clientEnvData)
    },
    plugins: [
      {
        name: 'inject-client-html-data',
        transformIndexHtml: (html) =>
          html.replaceAll('__THEME_BG__', clientEnvData.themeBg).replaceAll('__APP_NAME__', clientEnvData.appName)
      },
      vue(),
      !clientEnvData.isDev && generatePWAConfig({ appName: clientEnvData.appName, themeBg: clientEnvData.themeBg })
    ],
    resolve: {
      alias: [
        { find: 'src', replacement: path.resolve(__dirname, './src') },
        { find: /^global-shared$/, replacement: path.resolve(__dirname, '../global-shared/src/index.ts') },
        { find: /^global-shared\/(.*)$/, replacement: path.resolve(__dirname, '../global-shared/src/$1') }
      ]
    },
    build: {
      outDir: './build',
      ...tauriBuildConfig
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "src/app/styles/mixins" as *;'
        }
      }
    },
    server: {
      host: clientEnvData.tauriDevHost || (clientEnvData.isTauriDev ? '127.0.0.1' : true),
      port: clientEnvData.clientPort,
      strictPort: clientEnvData.isTauriDev,
      open: false,
      hmr,
      watch: {
        ignored: ['**/src-tauri/**']
      },
      ...httpsConfig
    }
  }
})
