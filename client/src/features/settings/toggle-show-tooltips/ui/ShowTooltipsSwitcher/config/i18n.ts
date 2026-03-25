import { type LocalizedTextType } from 'common-types'

export const SHOW_TOOLTIPS_SWITCHER_TEXT = {
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
} as const satisfies Record<string, LocalizedTextType>
