import { USER_FIXTURES } from 'src/entities/user'

export type FixtureUserByUsernameType = Record<string, (typeof USER_FIXTURES)[number]>
