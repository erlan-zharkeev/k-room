import { loadUsersFixtures } from './users'
export * from './helpers'
import { clc } from '../utils'

export const loadFixtures = async (loadAdmin = true) => {
  await loadUsersFixtures(loadAdmin)
  console.log(clc.green.bgWhite('-Fixtures loaded'))
}
