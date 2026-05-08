import { inject } from 'vue'

import { I18N_KEY } from './constants'

export const useI18n = () => {
  const t = inject(I18N_KEY)

  if (!t) {
    throw new Error('I18n is not provided')
  }

  return {
    t
  }
}
