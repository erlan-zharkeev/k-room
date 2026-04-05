import { LocalizedTextMapType } from 'common'

export const APP_INPUT_I18N = {
  clear: {
    en: 'Clear input',
    ru: 'Очистить поле'
  },
  showPassword: {
    en: 'Show password',
    ru: 'Показать пароль'
  },
  hidePassword: {
    en: 'Hide password',
    ru: 'Скрыть пароль'
  },
  loading: {
    en: 'Loading',
    ru: 'Загрузка'
  }
} as const satisfies LocalizedTextMapType
