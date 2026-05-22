import { NmorphLibrary } from '@nmorph/nmorph-ui-kit'
import type { AppLanguage } from 'global-shared'

import { createNmorphOptions } from '../lib/nmorph'

import type { VueApp } from './types'

export const initNmorphUi = (app: VueApp, language: AppLanguage) => {
  app.use(NmorphLibrary, createNmorphOptions(language))
}
