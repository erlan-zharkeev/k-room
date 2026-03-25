import { type LocalizedTextType } from 'common-types'

export const MESSAGE = {
  idNotProvideOrNotValid: {
    en: 'Id was not provided or is invalid',
    ru: 'Id не передан или некорректен'
  },
  failedToProvideMedia: {
    en: 'Failed to provide media file',
    ru: 'Не удалось отдать медиафайл'
  }
} as const satisfies Record<string, LocalizedTextType>
