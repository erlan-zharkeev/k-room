import type { AppLanguage } from 'global-shared'

export type LanguageSelectFlag = 'gb' | 'ru' | 'cn'

export interface LanguageSelectOption {
  flag: LanguageSelectFlag
  label: string
  value: AppLanguage
}
