import type { LocalizedText } from 'global-shared'

import type { TurnstileApi } from 'src/shared/ui/AppCaptcha/types'

import type { ClientEnv } from '../client-env.types'

declare global {
  const __CLIENT_ENV_DATA__: ClientEnv

  interface Window {
    turnstile?: TurnstileApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: <T>(value: LocalizedText<T>) => T
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    guestOnly?: boolean
    requiresAuth?: boolean
  }
}

export {}
