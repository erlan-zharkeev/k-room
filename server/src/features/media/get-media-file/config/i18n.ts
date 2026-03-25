import { type LocalizedTextMapType } from 'common'

export const MESSAGE = {
  idNotProvideOrNotValid: {
    en: 'Id was not provided or is invalid',
    ru: 'Id не передан или некорректен'
  },
  failedToProvideMedia: {
    en: 'Failed to provide media file',
    ru: 'Не удалось отдать медиафайл'
  }
} as const satisfies LocalizedTextMapType
