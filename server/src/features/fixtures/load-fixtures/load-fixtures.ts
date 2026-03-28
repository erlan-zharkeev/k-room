import { loadDialogFixtures } from 'src/features/fixtures/load-fixtures'

import { loadUserFixtures } from 'src/entities/user'

export const loadFixtures = async () => {
  await loadUserFixtures()
  await loadDialogFixtures()
}
