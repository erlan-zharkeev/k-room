import { DEFAULT_APP_LANGUAGE } from 'common'

import { loadUserFixtures } from 'src/modules/user'

import { loadDialogFixtures } from './lib/load-dialog-fixtures'

export const loadFixtures = async () => {
  await loadUserFixtures(DEFAULT_APP_LANGUAGE)
  await loadDialogFixtures()
}
