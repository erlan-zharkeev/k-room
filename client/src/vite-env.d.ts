import 'vite/client'

declare global {
  interface IE2EFirebaseAuthResult {
    displayName: string
    email: string
    photoURL: string
    uid: string
    provider: import('common').FirebaseProviderType
  }

  interface Window {
    $notifications: UseNotification
    __E2E_FIREBASE_AUTH_RESULT__?: IE2EFirebaseAuthResult
  }
}

export {}
