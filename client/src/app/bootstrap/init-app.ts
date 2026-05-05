import { router } from 'src/app/router'
import { initClientData } from 'src/features/client-session'
import { CLIENT_ENV } from 'src/shared/config'
import { pinia } from 'src/shared/lib'

import { initFirebase } from './init-firebase'
import { initI18n } from './init-i18n'
import { initNmorphUi } from './init-nmorph-ui'
import type { VueAppType } from './types'

export const initApp = (app: VueAppType) => {
  document.title = CLIENT_ENV.appName
  initFirebase()
  initI18n(app)
  initNmorphUi(app)
  app.use(pinia)
  app.use(router)
  void app.runWithContext(initClientData)
}
