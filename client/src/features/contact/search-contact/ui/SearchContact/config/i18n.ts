import { type LocalizedTextType } from 'common-types'

export const SEARCH_CONTACT_I18N = {
  placeholder: {
    en: 'Search contact',
    ru: 'Поиск контакта'
  },
  found: {
    en: (count: number) => `Found ${count} contacts`,
    ru: (count: number) => `Найдено контактов: ${count}`
  }
} as const satisfies Record<string, LocalizedTextType<any>>
