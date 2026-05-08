import { NmorphLibrary } from '@nmorph/nmorph-ui-kit'
import type { AppLanguageType } from 'global-shared'

import { createNmorphOptions } from '../lib/nmorph'

import type { VueAppType } from './types'

export const initNmorphUi = (app: VueAppType, language: AppLanguageType) => {
  app.use(NmorphLibrary, createNmorphOptions(language))
}
