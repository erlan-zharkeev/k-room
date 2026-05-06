import type { LocalizedTextType } from 'global-shared'

import type { ITurnstileApi } from 'src/shared/model'

declare global {
  const __CLIENT_ENV_DATA__: import('src/shared/model').IClientEnv

  interface Window {
    turnstile?: ITurnstileApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: <T>(value: LocalizedTextType<T>) => T
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    guestOnly?: boolean
    requiresAuth?: boolean
  }
}

export {}
