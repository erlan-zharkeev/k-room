import { VitePWA } from 'vite-plugin-pwa'

export const generatePWAConfig = ({ appName, themeBg }: { appName: string; themeBg: string }) =>
  VitePWA({
    registerType: 'prompt',
    devOptions: {
      enabled: true
    },
    injectRegister: 'auto',
    manifest: {
      name: appName,
      short_name: appName,
      description: 'Text and video chat',
      start_url: '/',
      display: 'standalone',
      background_color: themeBg,
      theme_color: themeBg,
      lang: 'en',
      scope: '/',
      orientation: 'any',
      screenshots: [
        {
          src: '/img/wide.webp',
          sizes: '1920x1080',
          type: 'image/webp',
          form_factor: 'wide'
        },
        {
          src: '/img/narrow.webp',
          sizes: '414x896',
          type: 'image/webp',
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
      globPatterns: [
        'index.html',
        'client-recovery.js',
        'registerSW.js',
        'manifest.webmanifest',
        'assets/*.js',
        'assets/*.css',
        'meta/*'
      ],
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
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            cacheableResponse: {
              statuses: [0, 200]
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
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  })
