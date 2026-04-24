import { FirebaseProviderType } from 'common'

export interface ILoginFormProps {
  onLogin: (payload: unknown) => void
  isLoading: boolean
  onFirebaseLogin: (provider: FirebaseProviderType) => void | Promise<void>
  isFirebaseLoginLoading: boolean
}
