import { type LocalizedTextType } from 'common'

import { getLocalizedText, useSettings } from './../'

export const useI18n = () => {
  const { language } = useSettings()

  const t = <T>(texts: LocalizedTextType<T>) => getLocalizedText(texts, language)

  return {
    language,
    t
  }
}
