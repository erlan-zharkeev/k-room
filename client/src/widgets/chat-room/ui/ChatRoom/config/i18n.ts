import { type LocalizedTextType } from 'common-types'

export const CHAT_ROOM_I18N = {
  groupChatInfo: {
    en: 'Group chat info',
    ru: 'Информация о групповом чате'
  }
} as const satisfies Record<string, LocalizedTextType>
