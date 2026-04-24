import type { LocalizedTextType } from 'global-shared'

import { CLIENT_LANGUAGE } from 'src/shared/config'

import type { VueAppType } from './types'

export const initI18n = (app: VueAppType) => {
  app.config.globalProperties.$t = <T>(value: LocalizedTextType<T>) => value[CLIENT_LANGUAGE]
}
