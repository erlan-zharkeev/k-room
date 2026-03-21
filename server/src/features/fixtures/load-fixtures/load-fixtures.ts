import { loadUserFixtures } from 'entities/user'

import { loadDialogFixtures } from './lib'

export const loadFixtures = async () => {
  await loadUserFixtures()
  await loadDialogFixtures()
}
