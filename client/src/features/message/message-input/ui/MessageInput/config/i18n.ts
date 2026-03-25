import { type LocalizedTextType } from 'common-types'

export const MESSAGE_INPUT_I18N = {
  placeholder: {
    en: 'Type message',
    ru: 'Введите сообщение'
  }
} as const satisfies Record<string, LocalizedTextType>
