import { type LocalizedTextMapType } from 'common'

export const I18N_GET_USER_DATA_MESSAGE = {
  failedGetUserData: {
    en: 'Failed to retrieve user data',
    ru: 'Не удалось получить данные пользователя'
  }
} as const satisfies LocalizedTextMapType
