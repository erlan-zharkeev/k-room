import { type AppLanguageType, DEFAULT_APP_LANGUAGE, type LocalizedTextType } from 'common'

type LanguageSourceType = AppLanguageType | { language?: AppLanguageType } | null | undefined

const getLanguage = (source?: LanguageSourceType): AppLanguageType | undefined => {
  if (typeof source === 'string') {
    return source
  }

  return source?.language
}

export const getLocalizedText = <T>(texts: LocalizedTextType<T>, source?: LanguageSourceType): T => {
  const language = getLanguage(source)

  return texts[language ?? DEFAULT_APP_LANGUAGE] ?? texts[DEFAULT_APP_LANGUAGE]
}
