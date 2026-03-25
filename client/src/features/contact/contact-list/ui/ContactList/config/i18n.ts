import { type LocalizedTextType } from 'common-types'

export const CONTACT_LIST_I18N = {
  empty: {
    en: 'There are no contacts yet',
    ru: 'Пока нет контактов'
  }
} as const satisfies Record<string, LocalizedTextType>
