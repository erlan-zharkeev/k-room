import { type LocalizedTextMapType } from 'common'

export const MESSAGE = {
  failed: {
    en: 'Failed to sign in with provider',
    ru: 'Не удалось войти через провайдера'
  }
} as const satisfies LocalizedTextMapType
