import { router } from 'src/app/router'
import { useSettings } from 'src/entities/setting'
import { initClientData, initClientIndexedDbData } from 'src/features/client-session'
import { setHttpClientLanguage, setSocketLanguage } from 'src/shared/api'
import { CLIENT_ENV } from 'src/shared/config'

import { pinia } from '../providers/pinia'

import { initFirebase } from './init-firebase'
import { initI18n } from './init-i18n'
import { initNmorphUi } from './init-nmorph-ui'
import type { VueAppType } from './types'

export const initApp = async (app: VueAppType) => {
  document.title = CLIENT_ENV.appName
  initFirebase()
  app.use(pinia)
  await app.runWithContext(initClientIndexedDbData)
  const { settings } = useSettings()
  const { language } = settings.value

  setHttpClientLanguage(language)
  setSocketLanguage(language)
  initI18n(app, language)
  initNmorphUi(app, language)
  app.use(router)
  void app.runWithContext(initClientData)
}
