import { defineI18n } from 'global-shared'

export const SHARED_I18N = defineI18n({
  success: {
    en: 'Success',
    ru: 'Успешно'
  },
  commonServerError: {
    en: 'Server error. The operation could not be performed. Please try again later',
    ru: 'Ошибка сервера. Операцию не удалось выполнить. Пожалуйста, попробуйте позже'
  }
})
