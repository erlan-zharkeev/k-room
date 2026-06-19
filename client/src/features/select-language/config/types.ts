import type { AppLanguage } from 'global-shared'

export type SelectLanguageOptionFlag = 'gb' | 'ru' | 'cn'

export interface SelectLanguageOption {
  flag: SelectLanguageOptionFlag
  value: AppLanguage
}
