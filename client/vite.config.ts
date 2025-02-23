import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const VITE_FIREBASE_API_KEY = JSON.stringify(env.VITE_FIREBASE_API_KEY)
  const isDev = mode === 'development'
  return {
    define: {
      VITE_FIREBASE_API_KEY
    },
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
                    maxEntries: 50
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
      host: '0.0.0.0',
      port: Number(env.VITE_CLIENT_PORT),
      https: {
        key: fs.readFileSync('./dev-certs/k-room-dev-key.pem'),
        cert: fs.readFileSync('./dev-certs/k-room-dev.pem')
      },
      proxy: {
        '/api': {
          target: `https://k-room-dev:${env.VITE_SERVER_PORT}`,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
