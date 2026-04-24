import { DEFAULT_APP_LANGUAGE } from 'common'

import { loadInfoNotificationFixtures } from 'src/modules/info-notification'
import { loadUserFixtures } from 'src/modules/user'

import { loadDialogFixtures } from './lib/load-dialog-fixtures'

export const loadFixtures = async () => {
  await loadInfoNotificationFixtures()
  await loadUserFixtures(DEFAULT_APP_LANGUAGE)
  await loadDialogFixtures()
}
