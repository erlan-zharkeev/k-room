import { defineI18n } from 'common'

export const ERROR_FALLBACK_I18N = defineI18n({
  message: {
    en: 'Something went wrong. Please reload the page.',
    ru: 'Что-то пошло не так. Пожалуйста, перезагрузите страницу.'
  },
  reload: {
    en: 'Reload',
    ru: 'Перезагрузить'
  }
})
