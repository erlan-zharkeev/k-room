import fs from 'fs'
import path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '..')
  const env = loadEnv(mode, envDir, '')
  const isDev = mode === 'development'

  return {
    define: {
      CLIENT_ENV_DATA: JSON.stringify({
        appName: env.APP_NAME,
        serverPort: Number(env.SERVER_PORT),
        clientPort: Number(env.CLIENT_PORT),
        appHost: env.APP_HOST,
        apiHost: env.API_HOST,
        maxReconnectAttempts: Number(env.MAX_RECONNECT_ATTEMPTS),
        firebaseApiKey: env.FIREBASE_API_KEY,
        sentryDsnClient: env.SENTRY_DSN_CLIENT,
        sentryEnvironment: env.SENTRY_ENVIRONMENT,
        sentryRelease: env.SENTRY_RELEASE,
        sentryEnabled: env.SENTRY_ENABLED === 'true'
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
            name: 'K-Room',
            short_name: 'K-Room',
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
        'common-types': path.resolve(__dirname, './../types')
      }
    },
    server: {
      // watch: {
      //   usePolling: true
      // },
      // hmr: {
      //   overlay: false,
      //   clientPort: 3001,
      //   strict: false
      // },
      // host: '0.0.0.0',
      historyApiFallback: true,
      port: Number(env.CLIENT_PORT),
      https: {
        key: fs.readFileSync('./dev-certs/k-room-dev-key.pem'),
        cert: fs.readFileSync('./dev-certs/k-room-dev.pem')
      },
      proxy: {
        '/api': {
          target: `${env.API_HOST}:${env.SERVER_PORT}`,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
