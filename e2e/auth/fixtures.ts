export const LOGIN_FIXTURE_USER = {
  nickname: 'Ethan',
  email: 'ethan@gmail.com',
  password: 'Asdf1234'
} as const

export const NICKNAME_LOGIN_FIXTURE_USER = {
  nickname: 'alex',
  email: 'alex@gmail.com',
  password: 'Asdf1234'
} as const

export const SETTINGS_FIXTURE_USER = {
  email: 'sam@gmail.com',
  password: 'Asdf1234',
  nextPassword: 'Asdf12345',
  nickname: 'sam'
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

export const buildPasswordRecoveryFixtureUser = () => {
  const suffix = Date.now().toString(36)

  return {
    nickname: `pw-recovery-${suffix}`,
    email: `pw-recovery-${suffix}@example.com`,
    password: 'Asdf1234'
  } as const
}
