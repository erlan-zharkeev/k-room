import { formatNickname } from 'global-shared'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import type { User } from './types'
import { useUserStore } from './user.store'

export const useUser = () => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)
  const isAuthorized = computed(() => Boolean(user.value.id))

  const avatarId = computed(() => (user.value.id ? `avatar.${user.value.id}` : ''))
  const displayedNickname = computed(() => formatNickname(user.value.nickname))

  return {
    user,
    displayedNickname,
    isAuthorized,
    avatarId,
    reset: async () => userStore.reset(),
    update: async (payload: Partial<User>) => userStore.update(payload)
  }
}
