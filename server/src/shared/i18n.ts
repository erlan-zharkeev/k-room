import { defineI18n } from 'global-shared'

export const SHARED_I18N = defineI18n({
  success: {
    en: 'Success',
    ru: 'Успешно',
    zh: '成功'
  },
  commonServerError: {
    en: 'Server error. The operation could not be performed. Please try again later',
    ru: 'Ошибка сервера. Операцию не удалось выполнить. Пожалуйста, попробуйте позже',
    zh: '服务器错误。无法执行操作，请稍后重试'
  }
})
