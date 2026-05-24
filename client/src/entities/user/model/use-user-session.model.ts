import { computed } from 'vue'

import { useUser } from './use-user.model'

export const useUserSession = () => {
  const { user } = useUser()

  const activeUser = computed(() => (user.value.id ? user.value : null))

  return {
    activeUser
  }
}
