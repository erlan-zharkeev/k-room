import type { IAuthLoginPayload } from 'global-shared'
import { ref } from 'vue'

export const useLogin = () => {
  const isLoading = ref(false)

  const onLogin = (_payload: IAuthLoginPayload) => {}

  return {
    isLoading,
    onLogin
  }
}
