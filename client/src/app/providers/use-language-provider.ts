import type { AppLanguageType } from 'global-shared'
import { watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { socket } from 'src/shared/api'
import { setClientLanguage } from 'src/shared/lib'

import { appI18n } from '../lib/i18n'

const setSocketLanguage = (language: AppLanguageType) => {
  socket.auth = {
    ...(typeof socket.auth === 'object' && socket.auth ? socket.auth : {}),
    language
  }
}

const updateSocketLanguage = (language: AppLanguageType) => {
  setSocketLanguage(language)
  socket.emit('update-language', { language })
}

export const useLanguageProvider = () => {
  const { settings } = useSettings()

  watch(
    () => settings.value.language,
    (language, previousLanguage) => {
      setClientLanguage(language)
      appI18n.global.locale.value = language
      setSocketLanguage(language)

      if (previousLanguage && previousLanguage !== language) {
        updateSocketLanguage(language)
      }
    },
    { immediate: true }
  )
}
