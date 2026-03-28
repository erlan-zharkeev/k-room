import { type LocalizedTextMapType } from 'common'

export const LOGOUT_I18N = {
  failed: {
    en: 'Failed to server logout',
    ru: 'Не удалось завершить сессию на сервере'
  }
} as const satisfies LocalizedTextMapType
