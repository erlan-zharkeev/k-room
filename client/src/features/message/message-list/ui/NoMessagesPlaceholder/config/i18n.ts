import { type LocalizedTextType } from 'common-types'

export const NO_MESSAGES_PLACEHOLDER_I18N = {
  text: {
    en: 'There are no messages, write first',
    ru: 'Сообщений пока нет, напишите первым'
  }
} as const satisfies Record<string, LocalizedTextType>
