import { loadDialogFixtures } from 'features/fixtures/load-fixtures/lib'

import { loadUserFixtures } from 'entities/user'

export const loadFixtures = async () => {
  await loadUserFixtures()
  await loadDialogFixtures()
}
