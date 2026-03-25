import { type AppLanguageType, DEFAULT_APP_LANGUAGE, type LocalizedTextType } from 'common-types'

export const getLocalizedText = <T>(texts: LocalizedTextType<T>, language?: AppLanguageType): T => {
  return texts[language ?? DEFAULT_APP_LANGUAGE] ?? texts[DEFAULT_APP_LANGUAGE]
}
