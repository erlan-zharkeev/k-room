import type { AppLanguageType, LocalizedTextType } from 'global-shared'
import { ref } from 'vue'

import { CLIENT_LANGUAGE } from 'src/shared/config'

export const currentLanguage = ref<AppLanguageType>(CLIENT_LANGUAGE)

export const setClientLanguage = (language: AppLanguageType) => {
  currentLanguage.value = language
}

export const t = <T>(value: LocalizedTextType<T>) => value[currentLanguage.value]
