import { USER_FIXTURES } from 'src/modules/user'

export type FixtureUserByUsernameType = Record<string, (typeof USER_FIXTURES)[number]>
