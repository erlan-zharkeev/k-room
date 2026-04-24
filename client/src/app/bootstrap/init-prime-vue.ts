import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import { primeVueTheme } from '../theme'

import type { VueAppType } from './types'

export const initPrimeVue = (app: VueAppType) => {
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: primeVueTheme,
      options: {
        darkModeSelector: '[theme="dark"]'
      }
    }
  })

  app.use(ToastService)
}
