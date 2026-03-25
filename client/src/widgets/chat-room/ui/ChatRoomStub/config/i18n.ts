import { type LocalizedTextType } from 'common-types'

export const CHAT_ROOM_STUB_I18N = {
  text: {
    en: 'Choose or create chat',
    ru: 'Выберите чат или создайте новый'
  }
} as const satisfies Record<string, LocalizedTextType>
