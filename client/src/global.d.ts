import type { LocalizedTextType } from 'global-shared'

declare global {
  const __CLIENT_ENV_DATA__: import('src/shared/types/client-env').IClientEnv
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: <T>(value: LocalizedTextType<T>) => T
  }
}

export {}
