import { loadUserFixtures } from 'src/features/user'

import { loadInfoNotificationFixtures } from 'src/entities/info-notification'

import { loadDialogFixtures } from './lib'

export const loadFixtures = async () => {
  await loadInfoNotificationFixtures()
  await loadUserFixtures()
  await loadDialogFixtures()
}
