import { VitePWA } from 'vite-plugin-pwa'

export const generatePWAConfig = ({
  appName,
  appVersion,
  themeBg
}: {
  appName: string
  appVersion: string
  themeBg: string
}) =>
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
      theme_color: themeBg,
      background_color: themeBg,
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
