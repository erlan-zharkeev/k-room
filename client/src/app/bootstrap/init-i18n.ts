import { t } from 'src/shared/lib'

import { appI18n } from '../lib/i18n'

import type { VueAppType } from './types'

export const initI18n = (app: VueAppType) => {
  app.use(appI18n)
  app.config.globalProperties.$t = t
}
