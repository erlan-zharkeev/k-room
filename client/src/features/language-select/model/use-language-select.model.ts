import { useSettings } from 'src/entities/setting'

import { LANGUAGE_SELECT_OPTIONS } from '../config/constants'

export const useLanguageSelect = () => {
  const { settings, setByPath } = useSettings()

  const changeLanguage = (value: string) => {
    const option = LANGUAGE_SELECT_OPTIONS.find((item) => item.value === value)

    if (!option || option.value === settings.value.localization.language) return

    void setByPath('localization.language', option.value)
  }

  return {
    settings,
    changeLanguage
  }
}
