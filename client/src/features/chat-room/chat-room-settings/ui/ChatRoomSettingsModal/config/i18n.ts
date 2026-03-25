import { type LocalizedTextType } from 'common-types'

export const CHAT_ROOM_SETTINGS_MODAL_I18N = {
  members: {
    en: 'Members:',
    ru: 'Участники:'
  },
  close: {
    en: 'Close',
    ru: 'Закрыть'
  }
} as const satisfies Record<string, LocalizedTextType>
