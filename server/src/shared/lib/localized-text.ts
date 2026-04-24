import { DEFAULT_APP_LANGUAGE, type AppLanguageType, type LocalizedTextType } from 'shared'

export const localizedText = (texts: LocalizedTextType<string>, language: AppLanguageType = DEFAULT_APP_LANGUAGE) => {
  return texts[language] ?? texts[DEFAULT_APP_LANGUAGE]
}
