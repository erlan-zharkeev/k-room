import { defineI18n } from 'global-shared'

export const HTTP_I18N = defineI18n({
  unknownError: {
    en: 'Unknown error',
    ru: 'Неизвестная ошибка',
    zh: '未知错误'
  },
  genericError: {
    en: (message: string) => `An error has occurred, please try again later. Error: ${message}`,
    ru: (message: string) => `Произошла ошибка, попробуйте позже. Ошибка: ${message}`,
    zh: (message: string) => `发生错误，请稍后重试。错误：${message}`
  }
})
