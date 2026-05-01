import type { AppLanguageType } from 'global-shared'

import { useSettings } from 'src/entities/setting'

export const useLanguageSelect = () => {
  const { settings, shallowUpdate } = useSettings()

  const changeLanguage = (value: AppLanguageType) => {
    if (value === settings.value.language) return

    void shallowUpdate({ language: value })
  }

  return {
    settings,
    changeLanguage
  }
}
