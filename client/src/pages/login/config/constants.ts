import type { AuthLoginPayload } from 'global-shared'

export const DEFAULT_LOGIN_FORM_DATA: AuthLoginPayload = {
  login: '',
  password: ''
}

export const E2E_FIREBASE_AUTH_RESULT = {
  displayName: 'pw-google-e2e',
  email: 'pw-google-e2e@example.com',
  photoURL: 'https://example.com/avatar.png',
  uid: 'pw-google-e2e',
  provider: 'google'
} as const
