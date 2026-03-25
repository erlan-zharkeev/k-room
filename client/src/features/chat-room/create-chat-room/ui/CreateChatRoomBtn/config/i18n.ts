import { type LocalizedTextType } from 'common-types'

export const CREATE_CHAT_ROOM_BTN_I18N = {
  button: {
    en: 'Create chat',
    ru: 'Создать чат'
  },
  modalTitle: {
    en: 'Create chat room',
    ru: 'Создать чат'
  }
} as const satisfies Record<string, LocalizedTextType>
