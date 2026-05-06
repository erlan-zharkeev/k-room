import type { ClientPlatformType } from 'src/shared/model'

export const getClientPlatform = (): ClientPlatformType => {
  return '__TAURI_INTERNALS__' in window ? 'native' : 'browser'
}
