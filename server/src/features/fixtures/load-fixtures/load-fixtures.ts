import { loadUserFixtures } from 'entities/user'

export const loadFixtures = async () => {
  await loadUserFixtures()
}
