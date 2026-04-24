import { USER_FIXTURES } from 'src/modules/user'

import { FixtureUserByUsernameType } from './types'

export const USER_BY_USERNAME: FixtureUserByUsernameType = Object.fromEntries(
  USER_FIXTURES.map((fixture) => [fixture.username, fixture])
)

export const ERLAN_ID = USER_BY_USERNAME.erlan?.id ?? ''
export const TOLIK_ID = USER_BY_USERNAME.tolik?.id ?? ''
