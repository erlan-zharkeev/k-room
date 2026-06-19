import { defineI18n } from '../i18n/define-i18n'

export const TOAST_I18N = defineI18n('toast', {
  success: {
    en: 'Success',
    ru: 'Успешно',
    zh: '成功'
  },
  info: {
    en: 'Info',
    ru: 'Информация',
    zh: '信息'
  },
  warn: {
    en: 'Warning',
    ru: 'Предупреждение',
    zh: '警告'
  },
  error: {
    en: 'Error',
    ru: 'Ошибка',
    zh: '错误'
  }
})
