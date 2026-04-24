import fs from 'fs'
import path from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '..')
  const commonEnv = loadEnv('common', envDir, '')
  const modeEnv = loadEnv(mode, envDir, '')
  const isDev = mode === 'development'
  const isTauriDev = process.env.npm_lifecycle_event === 'serve:tauri'
  const tauriDevHost = process.env.TAURI_DEV_HOST
  const clientPort = Number(commonEnv.CLIENT_PORT)
  const appHost = modeEnv.APP_HOST

  if (!Number.isInteger(clientPort) || clientPort <= 0) {
    throw new Error('CLIENT_PORT is required in .env.common')
  }

  if (!appHost) {
    throw new Error(`APP_HOST is required in .env.${mode}`)
  }

  return {
    clearScreen: false,
    envDir,
    envPrefix: ['VITE_', 'TAURI_ENV_*'],
    plugins: [vue()],
    resolve: {
      alias: [
        { find: 'src', replacement: path.resolve(__dirname, './src') },
        { find: /^shared$/, replacement: path.resolve(__dirname, '../shared/src/index.ts') },
        { find: /^shared\/(.*)$/, replacement: path.resolve(__dirname, '../shared/src/$1') }
      ]
    },
    build: {
      outDir: './build',
      ...(process.env.TAURI_ENV_PLATFORM
        ? {
            target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
            minify: process.env.TAURI_ENV_DEBUG ? false : 'esbuild',
            sourcemap: Boolean(process.env.TAURI_ENV_DEBUG)
          }
        : {})
    },
    server: {
      host: tauriDevHost || (isTauriDev ? '127.0.0.1' : true),
      port: clientPort,
      strictPort: isTauriDev,
      hmr: tauriDevHost
        ? {
            protocol: 'ws',
            host: tauriDevHost,
            port: clientPort + 1
          }
        : isTauriDev
        ? undefined
        : {
            host: new URL(appHost).hostname
          },
      watch: {
        ignored: ['**/src-tauri/**']
      },
      ...(isDev && !isTauriDev
        ? {
            https: {
              key: fs.readFileSync(path.resolve(__dirname, '../dev-certs/k-room-dev-key.pem')),
              cert: fs.readFileSync(path.resolve(__dirname, '../dev-certs/k-room-dev.pem'))
            }
          }
        : {})
    }
  }
})
