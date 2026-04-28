import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import { getThemePreset } from 'src/shared/lib'

import type { VueAppType } from './types'

export const initPrimeVue = (app: VueAppType) => {
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: getThemePreset()
    }
  })

  app.use(ToastService)
}
