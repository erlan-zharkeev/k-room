import { translate } from 'src/shared/lib'

import type { VueAppType } from './types'

export const initI18n = (app: VueAppType) => {
  app.config.globalProperties.$t = translate
}
