import { defineI18n, i18nFormatter } from 'src/shared/lib'

export const CHAT_ROOM_TYPING_I18N = defineI18n('chatRoomTyping', {
  typingStatus: {
    en: i18nFormatter(
      ['names'],
      (names: string[]) => `${names.join(', ')} ${names.length === 1 ? 'is typing' : 'are typing'}...`
    ),
    ru: i18nFormatter(
      ['names'],
      (names: string[]) => `${names.join(', ')} ${names.length === 1 ? 'набирает' : 'набирают'}...`
    ),
    zh: i18nFormatter(['names'], (names: string[]) => `${names.join(', ')}正在输入...`)
  }
})
