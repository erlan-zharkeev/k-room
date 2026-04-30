export const LOGIN_FIXTURE_USER = {
  nickname: 'erlan',
  email: 'erlan@gmail.com',
  password: 'Asdf1234'
} as const

export const SETTINGS_FIXTURE_USER = {
  email: 'guest@gmail.com',
  password: 'Asdf1234',
  nextPassword: 'Asdf12345',
  nickname: 'guest'
} as const

export const PASSWORD_RECOVERY_FIXTURE_USER = {
  email: 'tolik@gmail.com',
  password: 'Asdf1234',
  nextPassword: 'Asdf12345'
} as const

const buildUniqueSuffix = () => Date.now().toString()

export const buildRegistrationFixtureUser = () => {
  const suffix = buildUniqueSuffix()

  return {
    nickname: `pw-reg-${suffix}`,
    email: `pw-reg-${suffix}@example.com`,
    password: 'Asdf1234'
  } as const
}
