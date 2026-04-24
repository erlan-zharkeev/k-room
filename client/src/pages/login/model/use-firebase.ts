import type { FirebaseProviderType } from 'global-shared'
import { ref } from 'vue'

export const useFirebase = () => {
  const isFirebaseLoginLoading = ref(false)

  const onFirebaseLogin = (_provider: FirebaseProviderType) => {}

  return {
    isFirebaseLoginLoading,
    onFirebaseLogin
  }
}
