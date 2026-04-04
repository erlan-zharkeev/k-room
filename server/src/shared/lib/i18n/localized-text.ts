import { AppLanguageType, LocalizedTextType } from 'common'

export const localizedText = (texts: LocalizedTextType<string>, language: AppLanguageType) => {
  return texts[language] ?? 'Localized text not found/Не найден локализованный текст'
}
