import type { ChangeEvent } from 'react'

import { APP_LANGUAGE } from 'common'

import { useSettings } from 'src/entities/settings'

export const useLanguageSetting = () => {
  const settings = useSettings()

  const toggleLanguage = (event: ChangeEvent<HTMLInputElement>) => {
    const nextLanguage = event.target.checked ? APP_LANGUAGE.Ru : APP_LANGUAGE.En

    settings.update({ language: nextLanguage })
    document.documentElement.lang = nextLanguage
  }

  return {
    toggleLanguage
  }
}
