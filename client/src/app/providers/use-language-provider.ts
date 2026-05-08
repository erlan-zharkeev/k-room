import { watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { setHttpClientLanguage, setSocketLanguage, updateSocketLanguage } from 'src/shared/api'

import { setI18nLanguage } from '../lib/i18n'

export const useLanguageProvider = () => {
  const { settings } = useSettings()

  watch(
    () => settings.value.language,
    (language, previousLanguage) => {
      setI18nLanguage(language)
      setHttpClientLanguage(language)
      setSocketLanguage(language)

      if (previousLanguage && previousLanguage !== language) {
        updateSocketLanguage(language)
      }
    },
    { immediate: true }
  )
}
