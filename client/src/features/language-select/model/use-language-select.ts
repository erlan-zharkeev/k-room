import type { AppLanguageType } from 'global-shared'
import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'

export const useLanguageSelect = () => {
  const { language, shallowUpdate } = useSettings()

  const selectedLanguage = computed<AppLanguageType>({
    get: () => language.value,
    set: (value) => {
      if (!value || value === language.value) return

      void shallowUpdate({ language: value })
    }
  })

  return {
    selectedLanguage
  }
}
