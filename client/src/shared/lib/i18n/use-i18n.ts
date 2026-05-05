import type { LocalizedTextType } from 'global-shared'
import { getCurrentInstance } from 'vue'

import { t as fallbackT } from './language'

const fallbackTranslate = <T>(value: LocalizedTextType<T>) => fallbackT(value)

export const useI18n = () => {
  const instance = getCurrentInstance()
  const t = instance?.proxy?.$t ?? fallbackTranslate

  return {
    t
  }
}
