import { AppLanguageType, DEFAULT_APP_LANGUAGE, LocalizedTextType } from 'common'

import { useSettings } from './use-settings'

export const useI18n = () => {
  const { language }: { language: AppLanguageType } = useSettings()

  const t = <T>(texts: LocalizedTextType<T>): T => texts[language] ?? texts[DEFAULT_APP_LANGUAGE]

  return {
    language,
    t
  }
}
