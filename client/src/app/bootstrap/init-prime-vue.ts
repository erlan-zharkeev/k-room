import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import type { VueAppType } from './types'

export const initPrimeVue = (app: VueAppType) => {
  app.use(PrimeVue, {
    ripple: false,
    unstyled: true
  })
  app.use(ToastService)
}
