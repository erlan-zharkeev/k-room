import { type LocalizedTextMapType } from 'common'

export const MESSAGE = {
  failed: {
    en: 'Failed to server logout',
    ru: 'Не удалось завершить сессию на сервере'
  }
} as const satisfies LocalizedTextMapType
