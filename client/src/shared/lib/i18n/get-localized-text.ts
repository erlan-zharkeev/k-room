import { DEFAULT_APP_LANGUAGE, type AppLanguageType, type LocalizedTextType } from 'common'

export const getLocalizedText = <T>(texts: LocalizedTextType<T>, language: AppLanguageType): T => {
  return texts[language] ?? texts[DEFAULT_APP_LANGUAGE]
}
