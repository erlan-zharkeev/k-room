import type { AppLanguageType } from 'global-shared'

export interface IAppEmojiPickerProps {
  expandLabel: string
  language: AppLanguageType
}

export interface IAppEmojiPickerEmits {
  select: [value: string]
}

export type AppEmojiPickerEmitType = (event: 'select', value: string) => void
