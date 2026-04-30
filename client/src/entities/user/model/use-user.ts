import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { pinia } from 'src/shared/lib'

import type { User } from './types'
import { useUserStore } from './user.store'

export const useUser = () => {
  const userStore = useUserStore(pinia)
  const { user } = storeToRefs(userStore)
  const isAuthorized = computed(() => Boolean(user.value.id))
  const avatarId = computed(() => (user.value.id ? `avatar.${user.value.id}` : ''))

  return {
    user,
    isAuthorized,
    avatarId,
    reset: async () => userStore.reset(),
    update: async (payload: Partial<User>) => userStore.update(payload)
  }
}
