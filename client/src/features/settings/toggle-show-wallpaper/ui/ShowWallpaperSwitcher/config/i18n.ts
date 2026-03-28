import { type LocalizedTextMapType } from 'common'

export const SHOW_WALLPAPER_SWITCHER_I18N = {
  label: {
    en: 'Wallpaper',
    ru: 'Обои'
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
