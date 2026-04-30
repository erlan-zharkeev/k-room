import { FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import type { IAuthLoginPayload } from 'global-shared'

export const DEFAULT_LOGIN_FORM_DATA: IAuthLoginPayload = {
  login: '',
  password: ''
}

export const FIREBASE_PROVIDER_MAP = {
  google: GoogleAuthProvider,
  facebook: FacebookAuthProvider
} as const

export const E2E_FIREBASE_AUTH_RESULT = {
  displayName: 'pw-google-e2e',
  email: 'pw-google-e2e@example.com',
  photoURL: 'https://example.com/avatar.png',
  uid: 'pw-google-e2e',
  provider: 'google'
} as const
