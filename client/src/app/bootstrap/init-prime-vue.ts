import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import { primeVueTheme } from 'src/shared/lib'

import type { VueAppType } from './types'

export const initPrimeVue = (app: VueAppType) => {
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: primeVueTheme
    }
  })

  app.use(ToastService)
}
