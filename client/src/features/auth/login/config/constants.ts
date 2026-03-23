import { FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth'

export const FIREBASE_PROVIDER_MAP = {
  google: GoogleAuthProvider,
  facebook: FacebookAuthProvider
}
