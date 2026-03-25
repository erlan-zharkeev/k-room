import { type LocalizedTextType } from 'common-types'

export const LEGAL_INFO_LINK_I18N = {
  link: {
    en: 'Legal information',
    ru: 'Правовая информация'
  }
} as const satisfies Record<string, LocalizedTextType>
