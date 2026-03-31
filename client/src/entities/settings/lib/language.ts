import { APP_LANGUAGE, DEFAULT_APP_LANGUAGE, type AppLanguageType, type LocalizedTextType } from 'common'

export const normalizeAppLanguage = (value: string | null | undefined): AppLanguageType | null => {
  if (!value) return null
  const normalizedValue = value.toLowerCase()
  if (normalizedValue.startsWith(APP_LANGUAGE.Ru)) return APP_LANGUAGE.Ru
  if (normalizedValue.startsWith(APP_LANGUAGE.En)) return APP_LANGUAGE.En
  return null
}

export const getBrowserLanguage = (): AppLanguageType => {
  if (typeof navigator === 'undefined') return DEFAULT_APP_LANGUAGE
  const candidateLanguage = navigator.languages?.[0] ?? navigator.language
  return normalizeAppLanguage(candidateLanguage) ?? DEFAULT_APP_LANGUAGE
}

export const getLocalizedText = <T>(texts: LocalizedTextType<T>, language: AppLanguageType): T => {
  return texts[language] ?? texts[DEFAULT_APP_LANGUAGE]
}
