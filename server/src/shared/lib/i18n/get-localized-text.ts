import { AppLanguageType, DEFAULT_APP_LANGUAGE, LocalizedTextType } from 'common'

export const localizedText = (texts: LocalizedTextType<string>, language?: AppLanguageType) => {
  const currentLanguage = language ?? DEFAULT_APP_LANGUAGE
  return texts[currentLanguage]
}
