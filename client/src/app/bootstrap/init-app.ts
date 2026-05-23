import { useSettings } from 'src/entities/setting'
import { initClientData, initClientIndexedDbData } from 'src/features/client-session'
import { setHttpClientLanguage, setSocketLanguage } from 'src/shared/api'

import { pinia } from '../providers/pinia'
import { router } from '../router'

import { initFirebase } from './init-firebase'
import { initI18n } from './init-i18n'
import { initNmorphUi } from './init-nmorph-ui'
import type { VueApp } from './types'

export const initApp = async (app: VueApp) => {
  document.title = __CLIENT_ENV_DATA__.appName
  initFirebase()
  app.use(pinia)
  await app.runWithContext(initClientIndexedDbData)
  const { settings } = useSettings()
  const { language } = settings.value.localization

  setHttpClientLanguage(language)
  setSocketLanguage(language)
  initI18n(app, language)
  initNmorphUi(app, language)
  app.use(router)
  void app.runWithContext(initClientData)
}
