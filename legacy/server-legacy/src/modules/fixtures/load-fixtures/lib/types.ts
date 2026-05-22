import { USER_FIXTURES } from 'src/modules/user'

export type FixtureUserByUsername = Record<string, (typeof USER_FIXTURES)[number]>
