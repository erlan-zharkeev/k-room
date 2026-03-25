import { type LocalizedTextMapType } from 'common'

export const MESSAGE = {
  failedGetUserData: {
    en: 'Failed to retrieve user data',
    ru: 'Не удалось получить данные пользователя'
  }
} as const satisfies LocalizedTextMapType
