import { AppLanguage, LocalizedText } from 'common'

export const localizedText = (texts: LocalizedText<string>, language: AppLanguage) => {
  return texts[language] ?? 'Localized text not found/Не найден локализованный текст'
}
