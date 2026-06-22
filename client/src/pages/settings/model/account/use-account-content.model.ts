import { computed } from 'vue'

import { useUser } from 'src/entities/user'

export const useAccountContent = () => {
  const { user } = useUser()
  const canManageCredentials = computed(() => Boolean(user.value.id) && user.value.provider === 'app')

  return {
    canManageCredentials
  }
}
