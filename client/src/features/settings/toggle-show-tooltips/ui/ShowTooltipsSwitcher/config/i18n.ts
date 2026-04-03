import { LocalizedTextMapType } from 'common'

export const SHOW_TOOLTIPS_SWITCHER_I18N = {
  label: {
    en: 'Tooltips',
    ru: 'Подсказки'
  },
  show: {
    en: 'Show',
    ru: 'Вкл'
  },
  hide: {
    en: 'Hide',
    ru: 'Выкл'
  }
} as const satisfies LocalizedTextMapType
