import { AppLanguage, DEFAULT_APP_LANGUAGE, LocalizedText } from 'common'

import { useSettings } from './use-settings'

export const useI18n = () => {
  const { language }: { language: AppLanguage } = useSettings()

  const t = <T>(texts: LocalizedText<T>): T => texts[language] ?? texts[DEFAULT_APP_LANGUAGE]

  return {
    language,
    t
  }
}
