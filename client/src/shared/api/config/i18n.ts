import type { LocalizedTextMapType } from 'common'

export const API_I18N = {
  unknownError: {
    en: 'Unknown error',
    ru: 'Неизвестная ошибка'
  },
  genericError: {
    en: (msg: string) => `An error has occurred, please try again later. Error: ${msg}`,
    ru: (msg: string) => `Произошла ошибка, попробуйте позже. Ошибка: ${msg}`
  }
} as const satisfies LocalizedTextMapType<string | ((msg: string) => string)>
