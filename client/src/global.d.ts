import type { TurnstileApi } from 'src/shared/ui'

import type { ClientEnv } from '../client-env.types'

interface ClientRecoveryConfig {
  enabled: boolean
  appVersion: string
  runtimePolicyUrl: string
  requestTimeoutMs: number
  updateReloadStoragePrefix: string
}

declare global {
  const __CLIENT_ENV_DATA__: ClientEnv

  interface Window {
    turnstile?: TurnstileApi
    __K_ROOM_CLIENT_RECOVERY_CONFIG__?: ClientRecoveryConfig
    __K_ROOM_CLIENT_RECOVERY_READY__?: Promise<boolean>
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    guestOnly?: boolean
    requiresAuth?: boolean
  }
}

export {}
