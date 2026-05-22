import { DEFAULT_APP_LANGUAGE, type AppLanguage, type LocalizedText } from 'global-shared'

export const localizedText = (texts: LocalizedText<string>, language: AppLanguage = DEFAULT_APP_LANGUAGE) => {
  return texts[language] ?? texts[DEFAULT_APP_LANGUAGE]
}
