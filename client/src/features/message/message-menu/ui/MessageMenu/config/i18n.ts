import { type LocalizedTextType } from 'common-types'

export const MESSAGE_MENU_I18N = {
  reply: {
    en: 'Reply',
    ru: 'Ответить'
  },
  forward: {
    en: 'Forward',
    ru: 'Переслать'
  },
  delete: {
    en: 'Delete',
    ru: 'Удалить'
  },
  forwardModalTitle: {
    en: 'Forward message',
    ru: 'Переслать сообщение'
  }
} as const satisfies Record<string, LocalizedTextType>
