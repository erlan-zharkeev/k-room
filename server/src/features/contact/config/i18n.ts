import { LocalizedTextMapType } from 'common'

export const CONTACT_I18N = {
  interlocutorPingFailed: {
    en: 'Failed to update interlocutor status',
    ru: 'Не удалось обновить статус собеседника'
  },
  saveContactFailed: {
    en: 'Failed to save contact',
    ru: 'Не удалось сохранить контакт'
  },
  searchContactFailed: {
    en: 'Failed to search contacts',
    ru: 'Не удалось выполнить поиск контактов'
  },
  updateContactInteractionFailed: {
    en: 'Failed to update contact interaction',
    ru: 'Не удалось обновить взаимодействие с контактом'
  }
} as const satisfies LocalizedTextMapType
