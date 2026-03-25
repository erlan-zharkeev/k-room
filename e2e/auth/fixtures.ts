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

export const buildGoogleFixtureUser = () => {
  const suffix = buildUniqueSuffix()

  return {
    displayName: `pw-google-${suffix}`,
    email: `pw-google-${suffix}@example.com`,
    photoURL: 'https://example.com/avatar.png',
    uid: `pw-google-${suffix}`,
    provider: 'google'
  } as const
}
