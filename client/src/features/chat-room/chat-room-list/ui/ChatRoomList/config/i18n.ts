import { type LocalizedTextType } from 'common-types'

export const CHAT_ROOM_LIST_I18N = {
  empty: {
    en: 'There are no chats yet',
    ru: 'Пока нет чатов'
  }
} as const satisfies Record<string, LocalizedTextType>
