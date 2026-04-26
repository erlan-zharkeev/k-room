import type { LocalizedTextType } from 'global-shared'
import { getCurrentInstance } from 'vue'

import { translate } from './language'

const fallbackTranslate = <T>(value: LocalizedTextType<T>) => translate(value)

export const useI18n = () => {
  const instance = getCurrentInstance()
  const t = instance?.proxy?.$t ?? fallbackTranslate

  return {
    t
  }
}
