import { useSettings } from 'src/entities/setting'

import { LANGUAGE_SELECT_OPTIONS } from '../config/constants'

export const useLanguageSelect = () => {
  const { settings, setClientLanguage } = useSettings()

  const changeLanguage = (value: string) => {
    const option = LANGUAGE_SELECT_OPTIONS.find((item) => item.value === value)

    if (!option || option.value === settings.value.language) return

    void setClientLanguage(option.value)
  }

  return {
    settings,
    changeLanguage
  }
}
