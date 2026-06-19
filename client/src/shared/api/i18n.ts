import { defineI18n } from 'src/shared/lib'

export const API_I18N = defineI18n('api', {
  operationFailed: {
    en: 'Failed to perform operation. Please try again later.',
    ru: 'Не удалось выполнить операцию. Попробуйте позже.',
    zh: '操作失败。请稍后重试。'
  }
})
