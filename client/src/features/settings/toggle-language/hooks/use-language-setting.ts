import { ChangeEvent } from 'react'

import { APP_LANGUAGE } from 'common'

import { useSettings } from 'src/entities/settings'

import { socket } from 'src/shared/api'

export const useLanguageSetting = () => {
  const { language, shallowUpdate } = useSettings()

  const toggleLanguage = (event: ChangeEvent<HTMLInputElement>) => {
    const language = event.target.checked ? APP_LANGUAGE.Ru : APP_LANGUAGE.En
    shallowUpdate({ language })
    document.documentElement.lang = language
    socket.auth = {
      ...(typeof socket.auth === 'object' && socket.auth ? socket.auth : {}),
      language
    }
    socket.emit('update-language', { language })
  }

  const isLangRu = () => language === APP_LANGUAGE.Ru

  return {
    toggleLanguage,
    language,
    isLangRu
  }
}
