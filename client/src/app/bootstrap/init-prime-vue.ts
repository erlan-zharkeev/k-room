import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import { getThemePreset } from '../lib/theme-preset'

import type { VueAppType } from './types'

export const initPrimeVue = (app: VueAppType) => {
  app.use(PrimeVue, {
    ripple: false,
    theme: {
      preset: getThemePreset()
    }
  })

  app.use(ToastService)
}
