import PrimeVue from 'primevue/config'

import type { VueAppType } from './types'

export const initPrimeVue = (app: VueAppType) => {
  app.use(PrimeVue, {
    ripple: false,
    unstyled: true
  })
}
