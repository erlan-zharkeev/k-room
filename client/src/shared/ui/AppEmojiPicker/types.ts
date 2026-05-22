import type { AppLanguage } from 'global-shared'

export interface AppEmojiPickerProps {
  expandLabel: string
  language: AppLanguage
}

export interface AppEmojiPickerEmits {
  select: [value: string]
}

export type AppEmojiPickerEmit = (event: 'select', value: string) => void
