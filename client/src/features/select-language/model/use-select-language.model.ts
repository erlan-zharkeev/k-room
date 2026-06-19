import { useSettings } from 'src/entities/setting'

import { SELECT_LANGUAGE_OPTIONS } from '../config/constants'

export const useSelectLanguage = () => {
  const { settings, setByPath } = useSettings()

  const changeLanguage = (value: string) => {
    const option = SELECT_LANGUAGE_OPTIONS.find((item) => item.value === value)

    if (!option || option.value === settings.value.localization.language) return

    void setByPath('localization.language', option.value)
  }

  return {
    settings,
    changeLanguage
  }
}
