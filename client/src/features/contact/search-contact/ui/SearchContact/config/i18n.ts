import { LocalizedTextMapType } from 'common'

export const SEARCH_CONTACT_I18N = {
  placeholder: {
    en: 'Search contact',
    ru: 'Поиск контакта'
  },
  found: {
    en: (count: number) => `Found ${count} contacts`,
    ru: (count: number) => `Найдено контактов: ${count}`
  },
  loadingMore: {
    en: 'Loading',
    ru: 'Загрузка'
  }
} as const satisfies LocalizedTextMapType<any>
