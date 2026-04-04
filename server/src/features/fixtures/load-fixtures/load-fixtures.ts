import { DEFAULT_APP_LANGUAGE } from 'common'

import { loadUserFixtures } from 'src/features/user'

import { loadInfoNotificationFixtures } from 'src/entities/info-notification'

import { loadDialogFixtures } from './lib'

export const loadFixtures = async () => {
  await loadInfoNotificationFixtures()
  await loadUserFixtures(DEFAULT_APP_LANGUAGE)
  await loadDialogFixtures()
}
