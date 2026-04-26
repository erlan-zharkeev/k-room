import { router } from 'src/app/router'
import { initClientData } from 'src/features/client-session'
import { CLIENT_ENV } from 'src/shared/config'

import { initFirebase } from './init-firebase'
import { initI18n } from './init-i18n'
import { initPrimeVue } from './init-prime-vue'
import type { VueAppType } from './types'

export const initApp = (app: VueAppType) => {
  document.title = CLIENT_ENV.appName
  initFirebase()
  initI18n(app)
  initPrimeVue(app)
  app.use(router)
  void app.runWithContext(initClientData)
}
