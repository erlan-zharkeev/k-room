import { type LocalizedTextType } from 'common-types'

export const MESSAGE_WITH_BIND_DATA_MODAL_I18N = {
  title: {
    en: 'Send message',
    ru: 'Отправить сообщение'
  }
} as const satisfies Record<string, LocalizedTextType>
