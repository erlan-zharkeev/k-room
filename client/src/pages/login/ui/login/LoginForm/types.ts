import type { FirebaseProviderType, IAuthLoginPayload } from 'global-shared'

export interface ILoginFormProps {
  isLoading: boolean
  onLogin: (payload: IAuthLoginPayload) => void
  onFirebaseLogin: (provider: FirebaseProviderType) => void
  isFirebaseLoginLoading: boolean
}
