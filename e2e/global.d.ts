import type { FirebaseProviderType } from 'common'

declare global {
  interface Window {
    __E2E_FIREBASE_AUTH_RESULT__?: {
      displayName: string
      email: string
      photoURL: string
      uid: string
      provider: FirebaseProviderType
    }
  }

  // eslint-disable-next-line no-var
  var window: Window & typeof globalThis
}
