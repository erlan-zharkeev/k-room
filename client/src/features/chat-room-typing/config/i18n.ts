import { defineI18n } from 'global-shared'

export const CHAT_ROOM_TYPING_I18N = defineI18n({
  typingStatus: {
    en: (names: string[]) => `${names.join(', ')} ${names.length === 1 ? 'is typing' : 'are typing'}...`,
    ru: (names: string[]) => `${names.join(', ')} ${names.length === 1 ? 'набирает' : 'набирают'}...`,
    zh: (names: string[]) => `${names.join(', ')}正在输入...`
  }
})
