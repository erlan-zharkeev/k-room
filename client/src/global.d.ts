import type { LocalizedTextType } from 'global-shared'

import type { ITurnstileApi } from 'src/shared/ui/AppCaptcha/types'

import type { IClientEnv } from '../client-env.types'

declare global {
  const __CLIENT_ENV_DATA__: IClientEnv

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
