import { type LocalizedTextType } from 'common-types'

export const PAGE_LAYOUT_TEXT = {
  back: {
    en: 'Back',
    ru: 'Назад'
  }
} as const satisfies Record<string, LocalizedTextType>
