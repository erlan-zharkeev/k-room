import { LocalizedTextMapType } from 'common'

export const CONTACT_MENU_I18N = {
  call: {
    en: 'Call',
    ru: 'Позвонить'
  },
  createChat: {
    en: 'Create chat',
    ru: 'Создать чат'
  },
  creatingChat: {
    en: 'Creating chat',
    ru: 'Создание чата'
  },
  text: {
    en: 'Text',
    ru: 'Написать'
  },
  delete: {
    en: 'Delete',
    ru: 'Удалить'
  }
} as const satisfies LocalizedTextMapType
