import { type LocalizedTextMapType } from 'common'

export const EDIT_USER_DATA_MODAL_I18N = {
  usernamePlaceholder: {
    en: 'Username',
    ru: 'Имя пользователя'
  },
  submit: {
    en: 'Apply',
    ru: 'Применить'
  },
  reset: {
    en: 'Reset',
    ru: 'Сбросить'
  }
} as const satisfies LocalizedTextMapType
