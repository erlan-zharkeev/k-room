import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import { defaultThemePreset } from 'src/shared/lib'

import type { VueAppType } from './types'

export const initPrimeVue = (app: VueAppType) => {
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: defaultThemePreset
    }
  })

  app.use(ToastService)
}
