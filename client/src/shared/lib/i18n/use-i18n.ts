import type { LocalizedTextType } from 'global-shared'
import { getCurrentInstance } from 'vue'

import { CLIENT_LANGUAGE } from 'src/shared/config'

const fallbackTranslate = <T>(value: LocalizedTextType<T>) => value[CLIENT_LANGUAGE]

export const useI18n = () => {
  const instance = getCurrentInstance()
  const t = instance?.proxy?.$t ?? fallbackTranslate

  return {
    t
  }
}
