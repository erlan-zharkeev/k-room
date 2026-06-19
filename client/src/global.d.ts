import type { TurnstileApi } from 'src/shared/ui'

import type { ClientEnv } from '../client-env.types'

declare global {
  const __CLIENT_ENV_DATA__: ClientEnv

  interface Window {
    turnstile?: TurnstileApi
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    guestOnly?: boolean
    requiresAuth?: boolean
  }
}

export {}
