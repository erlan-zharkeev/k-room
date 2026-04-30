import type { LocalizedTextType } from 'global-shared'

import type { PageLayoutPropsType } from 'src/app/layouts/page-layout/types'
import type { ITurnstileApi } from 'src/shared/types/captcha'

declare global {
  const __CLIENT_ENV_DATA__: import('src/shared/types/client-env').IClientEnv

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
    pageLayout?: PageLayoutPropsType
    requiresAuth?: boolean
  }
}

export {}
