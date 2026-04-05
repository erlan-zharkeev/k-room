import { defineI18n } from 'common'

export const API_I18N = defineI18n({
  unknownError: {
    en: 'Unknown error',
    ru: 'Неизвестная ошибка'
  },
  genericError: {
    en: (msg: string) => `An error has occurred, please try again later. Error: ${msg}`,
    ru: (msg: string) => `Произошла ошибка, попробуйте позже. Ошибка: ${msg}`
  }
})
