import fs from 'fs'
import path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

import packageJson from './package.json'

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '..')
  const env = loadEnv(mode, envDir, '')
  const isDev = mode === 'development'

  const { APP_HOST, API_HOST, SERVER_PORT, CLIENT_PORT, FIREBASE_API_KEY, SENTRY_ENVIRONMENT, SENTRY_ENABLED } = env

  const { name: appName, version: appVersion } = packageJson
  const API_PREFIX = '/api'

  return {
    define: {
      CLIENT_ENV_DATA: JSON.stringify({
        isDev,
        isE2E: process.env.E2E === 'true',
        appName,
        appVersion,
        serverPort: Number(SERVER_PORT),
        clientPort: Number(CLIENT_PORT),
        appHost: APP_HOST,
        apiHost: API_HOST,
        firebaseApiKey: FIREBASE_API_KEY,
        sentryDsnClient:
          'https://b10bd66a4f5c0bc565edbe0e0d5d9b02@o4511099405139968.ingest.us.sentry.io/4511099424997376',
        sentryEnvironment: SENTRY_ENVIRONMENT,
        sentryEnabled: SENTRY_ENABLED === 'true',
        socketBaseUrl: isDev ? `${APP_HOST}:${SERVER_PORT}` : API_HOST,
        apiBaseUrl: isDev ? `${API_PREFIX}` : `${API_HOST}${API_PREFIX}`
      })
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
      nodePolyfills(),
      react(),
      svgr({}),
      !isDev &&
        VitePWA({
          registerType: 'autoUpdate',
          devOptions: {
            enabled: true
          },
          injectRegister: 'auto',
          manifest: {
            name: appName,
            short_name: appVersion,
            description: 'Text and video chat',
            theme_color: '#1c1c1c',
            background_color: '#1c1c1c',
            orientation: 'any',
            screenshots: [
              {
                src: '/img/wide.png',
                sizes: '1920x1080',
                type: 'image/png',
                form_factor: 'wide'
              },
              {
                src: '/img/narrow.png',
                sizes: '414x896',
                type: 'image/png',
                form_factor: 'narrow'
              }
            ],
            icons: [
              {
                src: '/meta/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/meta/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          },
          workbox: {
            runtimeCaching: [
              {
                urlPattern: ({ request }) => request.destination === 'document',
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'html-cache'
                }
              },
              {
                urlPattern: ({ request }) => request.destination === 'style',
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'style-cache'
                }
              },
              {
                urlPattern: ({ request }) => request.destination === 'script',
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'script-cache'
                }
              },
              {
                urlPattern: /.*\.mp3$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'audio-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200, 206]
                  }
                }
              },
              {
                urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'image-cache',
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              }
            ]
          }
        })
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
      // host: '0.0.0.0',
      historyApiFallback: true,
      port: Number(CLIENT_PORT),
      ...(isDev
        ? {
            https: {
              key: fs.readFileSync('./dev-certs/k-room-dev-key.pem'),
              cert: fs.readFileSync('./dev-certs/k-room-dev.pem')
            }
          }
        : {}),
      proxy: {
        [API_PREFIX]: {
          target: `${API_HOST}:${SERVER_PORT}`,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
