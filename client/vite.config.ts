import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

import vue from '@vitejs/plugin-vue'
import { CLIENT_RUNTIME_ENDPOINTS } from 'global-shared'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

import { createClientEnvData } from './create-client-env-data'
import {
  APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE,
  NOTIFICATION_FOREGROUND_SERVICE_WORKER_SYNC_MESSAGE_TYPE
} from './src/pages/app/config/service-worker-message.constants'
import { CLIENT_UPDATE_RELOAD_STORAGE_PREFIX } from './src/shared/api/constants'
import { generatePWAConfig } from './vite.pwa.config'

const WEB_PUSH_SERVICE_WORKER_FILE_NAME = 'web-push-sw.js'
const SERVICE_WORKER_MESSAGE_TYPE_PLACEHOLDERS = {
  __APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE__: APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE,
  __NOTIFICATION_FOREGROUND_SERVICE_WORKER_SYNC_MESSAGE_TYPE__: NOTIFICATION_FOREGROUND_SERVICE_WORKER_SYNC_MESSAGE_TYPE
}

const injectServiceWorkerMessageTypes = (source: string) =>
  Object.entries(SERVICE_WORKER_MESSAGE_TYPE_PLACEHOLDERS).reduce(
    (content, [placeholder, value]) => content.replaceAll(placeholder, value),
    source
  )

const createWebPushServiceWorkerMessageTypesPlugin = (): Plugin => {
  let buildOutDir = ''

  return {
    name: 'inject-web-push-service-worker-message-types',
    configResolved(config) {
      buildOutDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.resolve(config.root, config.build.outDir)
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] !== `/${WEB_PUSH_SERVICE_WORKER_FILE_NAME}`) {
          next()
          return
        }

        const source = fs.readFileSync(path.resolve(__dirname, './public/web-push-sw.js'), 'utf8')

        response.statusCode = 200
        response.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        response.end(injectServiceWorkerMessageTypes(source))
      })
    },
    closeBundle() {
      const serviceWorkerPath = path.resolve(buildOutDir, WEB_PUSH_SERVICE_WORKER_FILE_NAME)

      if (!fs.existsSync(serviceWorkerPath)) return

      const source = fs.readFileSync(serviceWorkerPath, 'utf8')

      fs.writeFileSync(serviceWorkerPath, injectServiceWorkerMessageTypes(source), 'utf8')
    }
  }
}

const createBuildOverwriteCssPlugin = (): Plugin => ({
  name: 'inject-build-overwrite-css',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: (html) => {
      const source = fs.readFileSync(path.resolve(__dirname, './src/app/styles/overwrite.scss'), 'utf8')
      const hash = crypto.createHash('sha256').update(source).digest('hex').slice(0, 8)

      return html.replace(
        '</head>',
        `    <link rel="stylesheet" crossorigin href="/assets/overwrite.css?v=${hash}">\n  </head>`
      )
    }
  },
  generateBundle() {
    const source = fs.readFileSync(path.resolve(__dirname, './src/app/styles/overwrite.scss'), 'utf8')

    this.emitFile({
      type: 'asset',
      fileName: 'assets/overwrite.css',
      source
    })
  }
})

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '..')
  const { TAURI_ENV_DEBUG, TAURI_ENV_PLATFORM } = process.env
  const clientEnvData = createClientEnvData(mode, envDir)
  const isTauriBuild = Boolean(TAURI_ENV_PLATFORM)
  const clientRecoveryConfig = {
    enabled: !clientEnvData.isDev && !isTauriBuild,
    appVersion: clientEnvData.appVersion,
    runtimePolicyUrl: `${clientEnvData.apiBaseUrl}${CLIENT_RUNTIME_ENDPOINTS.getRuntimePolicy}`,
    requestTimeoutMs: 5_000,
    updateReloadStoragePrefix: CLIENT_UPDATE_RELOAD_STORAGE_PREFIX
  }
  const serviceWorkerRegisterScript =
    !clientEnvData.isDev && !isTauriBuild ? '<script src="/service-worker-register.js"></script>' : ''

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
          html
            .replaceAll('__THEME_BG__', clientEnvData.themeBg)
            .replaceAll('__APP_NAME__', clientEnvData.appName)
            .replaceAll('__CLIENT_RECOVERY_CONFIG__', JSON.stringify(clientRecoveryConfig).replace(/</g, '\\u003c'))
            .replaceAll('__SERVICE_WORKER_REGISTER_SCRIPT__', serviceWorkerRegisterScript)
      },
      createWebPushServiceWorkerMessageTypesPlugin(),
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag === 'emoji-picker'
          }
        }
      }),
      !clientEnvData.isDev &&
        !isTauriBuild &&
        generatePWAConfig({ appName: clientEnvData.appName, themeBg: clientEnvData.themeBg }),
      createBuildOverwriteCssPlugin()
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
      minify: 'esbuild',
      cssMinify: 'esbuild',
      cssCodeSplit: false,
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
    },
    preview: {
      host: new URL(clientEnvData.appHost).hostname,
      port: clientEnvData.clientPort,
      strictPort: true,
      open: false,
      ...httpsConfig
    }
  }
})
