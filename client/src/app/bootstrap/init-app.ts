import { useSettings } from 'src/entities/setting'
import { initClientData, initClientIndexedDbData } from 'src/features/client-session'
import { setHttpClientLanguage, setSocketLanguage } from 'src/shared/api'
import { log } from 'src/shared/lib'

import { pinia } from '../providers/pinia'
import { router } from '../router'

import { initI18n } from './init-i18n'
import { initNmorphUi } from './init-nmorph-ui'
import { initSentry } from './init-sentry'
import { initNativeDesktopWebCache } from './native-desktop-cache/native-desktop-cache-control.model'
import type { VueApp } from './types'

export const initApp = async (app: VueApp) => {
  const { appName, appVersion } = __CLIENT_ENV_DATA__

  document.title = appName
  log('success', `${appName} (v${appVersion})`)
  const isNativeDesktopCacheReloading = await initNativeDesktopWebCache()

  if (isNativeDesktopCacheReloading) return

  app.use(pinia)
  await app.runWithContext(initClientIndexedDbData)
  const { settings } = useSettings()
  const { language } = settings.value.localization

  setHttpClientLanguage(language)
  setSocketLanguage(language)
  initI18n(app, language)
  initNmorphUi(app, language, settings.value.appearance)
  app.use(router)
  initSentry(app)
  void app.runWithContext(initClientData)
  await router.isReady()
}
