import type { AppLanguageType } from 'global-shared'
import { watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { socket } from 'src/shared/api'
import { setClientLanguage } from 'src/shared/lib'

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
      setSocketLanguage(language)

      if (previousLanguage && previousLanguage !== language) {
        updateSocketLanguage(language)
      }
    },
    { immediate: true }
  )
}
