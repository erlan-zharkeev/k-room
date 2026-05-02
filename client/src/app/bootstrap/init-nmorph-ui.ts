import { NmorphLibrary } from '@nmorph/nmorph-ui-kit'

import { currentLanguage } from 'src/shared/lib'

import { createNmorphOptions } from '../lib/nmorph'

import type { VueAppType } from './types'

export const initNmorphUi = (app: VueAppType) => {
  app.use(NmorphLibrary, createNmorphOptions(currentLanguage.value))
}
