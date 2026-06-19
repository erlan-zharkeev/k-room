import { AUTH_FIXTURE_PASSWORD } from './constants'

const buildUniqueSuffix = () => Date.now().toString()

export const buildRegistrationFixtureUser = () => {
  const suffix = buildUniqueSuffix()

  return {
    nickname: `pw-reg-${suffix}`,
    email: `pw-reg-${suffix}@example.com`,
    password: AUTH_FIXTURE_PASSWORD
  } as const
}

export const buildPasswordRecoveryFixtureUser = () => {
  const suffix = Date.now().toString(36)

  return {
    nickname: `pw-recovery-${suffix}`,
    email: `pw-recovery-${suffix}@example.com`,
    password: AUTH_FIXTURE_PASSWORD
  } as const
}
