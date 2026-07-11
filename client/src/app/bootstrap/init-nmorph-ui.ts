import { NmorphLibrary } from '@nmorph/nmorph-ui-kit'
import type { AppLanguage } from 'global-shared'

import type { AppearanceSettings } from 'src/entities/setting'

import { createNmorphOptions } from '../lib/nmorph'

import type { VueApp } from './types'

export const initNmorphUi = (app: VueApp, language: AppLanguage, appearance: AppearanceSettings) => {
  app.use(NmorphLibrary, createNmorphOptions(language, appearance))
}
