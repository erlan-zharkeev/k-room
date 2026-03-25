import { type AppLanguageType } from 'common'

import { useSettings } from 'src/entities/settings'

import { socket } from 'src/shared/api'

export const useLanguage = () => {
  const settings = useSettings()
  const { language } = settings

  const updateLanguage = (nextLanguage: AppLanguageType) => {
    settings.update({ language: nextLanguage })
    document.documentElement.lang = nextLanguage
    socket.auth = {
      ...(typeof socket.auth === 'object' && socket.auth ? socket.auth : {}),
      language: nextLanguage
    }
  }

  return {
    language,
    updateLanguage
  }
}
