import { LocalizedTextMapType } from 'common'

export const GET_USER_DATA_I18N = {
  failedGetUserData: {
    en: 'Failed to retrieve user data',
    ru: 'Не удалось получить данные пользователя'
  }
} as const satisfies LocalizedTextMapType
