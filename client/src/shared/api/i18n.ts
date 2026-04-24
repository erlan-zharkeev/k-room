import { defineI18n } from 'global-shared'

export const API_I18N = defineI18n({
  unknownError: {
    en: 'Unknown error',
    ru: 'Неизвестная ошибка'
  },
  genericError: {
    en: (message: string) => `An error has occurred, please try again later. Error: ${message}`,
    ru: (message: string) => `Произошла ошибка, попробуйте позже. Ошибка: ${message}`
  }
})
