export const LOGIN_FIXTURE_USER = {
  email: 'erlan@gmail.com',
  password: 'Asdf1234'
} as const

export const PASSWORD_RECOVERY_FIXTURE_USER = {
  email: 'erlan@gmail.com',
  password: 'Asdf1234',
  nextPassword: 'Asdf12345'
} as const

const buildUniqueSuffix = () => Date.now().toString()

export const buildRegistrationFixtureUser = () => {
  const suffix = buildUniqueSuffix()

  return {
    username: `pw-reg-${suffix}`,
    email: `pw-reg-${suffix}@example.com`,
    password: 'Asdf1234'
  } as const
}
