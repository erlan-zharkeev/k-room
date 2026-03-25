import { type LocalizedTextType } from 'common-types'

export const SHOW_WALLPAPER_SWITCHER_TEXT = {
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
} as const satisfies Record<string, LocalizedTextType>
