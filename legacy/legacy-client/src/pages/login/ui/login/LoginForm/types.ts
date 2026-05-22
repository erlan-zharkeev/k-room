import { FirebaseProvider } from 'common'

export interface LoginFormProps {
  onLogin: (payload: unknown) => void
  isLoading: boolean
  onFirebaseLogin: (provider: FirebaseProvider) => void | Promise<void>
  isFirebaseLoginLoading: boolean
}
