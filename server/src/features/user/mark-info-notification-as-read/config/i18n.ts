import { type LocalizedTextMapType } from 'common'

export const MESSAGE = {
  failed: {
    en: 'Failed to mark info notification as read',
    ru: 'Не удалось отметить инфо уведомление как прочитанное'
  }
} as const satisfies LocalizedTextMapType
