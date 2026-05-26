import type { EmojiClickEvent, I18n } from 'emoji-picker-element/shared'
import type { AppLanguage } from 'global-shared'

export interface AppEmojiPickerProps {
  expandLabel: string
  language: AppLanguage
}

export interface AppEmojiPickerEmits {
  select: [value: string]
}

export type AppEmojiPickerEmit = (event: 'select', value: string) => void

export interface EmojiPickerProps {
  dataSource: string
  i18n?: I18n
  language: AppLanguage
}

export interface EmojiPickerEmits {
  emojiClick: [event: EmojiClickEvent]
}
