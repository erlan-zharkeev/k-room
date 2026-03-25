import { type LocalizedTextType } from 'common-types'

import { useSettings } from 'src/entities/settings'

import { getLocalizedText } from 'src/shared/lib'

export const useI18n = () => {
  const { language } = useSettings()

  const t = <T>(texts: LocalizedTextType<T>) => getLocalizedText(texts, language)

  return {
    language,
    t
  }
}
