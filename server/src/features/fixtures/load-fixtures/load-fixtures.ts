import { loadDialogFixtures } from 'src/features/fixtures'

import { loadInfoNotificationFixtures } from 'src/entities/info-notification'
import { loadUserFixtures } from 'src/entities/user'

export const loadFixtures = async () => {
  await loadInfoNotificationFixtures()
  await loadUserFixtures()
  await loadDialogFixtures()
}
