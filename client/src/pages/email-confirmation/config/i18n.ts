import { defineI18n } from 'src/shared/lib'

export const EMAIL_CONFIRMATION_I18N = defineI18n('emailConfirmation', {
  title: {
    en: 'Congratulations',
    ru: 'Готово',
    zh: '完成'
  },
  loading: {
    en: 'Confirming email',
    ru: 'Подтверждаем email',
    zh: '正在确认 email'
  },
  back: {
    en: 'Back',
    ru: 'Назад',
    zh: '返回'
  }
})
