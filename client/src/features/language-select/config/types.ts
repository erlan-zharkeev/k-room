import type { AppLanguageType } from 'global-shared'

export type LanguageSelectFlagType = 'gb' | 'ru' | 'cn'

export interface ILanguageSelectOption {
  flag: LanguageSelectFlagType
  label: string
  value: AppLanguageType
}
