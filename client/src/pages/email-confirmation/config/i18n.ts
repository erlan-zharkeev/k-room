import { defineI18n } from 'global-shared'

export const EMAIL_CONFIRMATION_I18N = defineI18n({
  title: {
    en: 'Congratulations',
    ru: 'Готово',
    zh: '完成'
  },
  confirmed: {
    en: 'confirmed',
    ru: 'подтверждён',
    zh: '已确认'
  },
  back: {
    en: 'Back',
    ru: 'Назад',
    zh: '返回'
  },
  loading: {
    en: 'Confirming email',
    ru: 'Подтверждаем email',
    zh: '正在确认 email'
  },
  failed: {
    en: 'Email confirmation failed',
    ru: 'Не удалось подтвердить email',
    zh: '邮箱确认失败'
  }
})
