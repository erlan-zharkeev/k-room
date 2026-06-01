import { formatNickname, type UserData } from 'global-shared'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useUserStore } from './user.store.model'

export const useUser = () => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)
  const isAuthorized = computed(() => Boolean(user.value.id))

  const avatarId = computed(() => user.value.avatarId)
  const displayedNickname = computed(() => formatNickname(user.value.nickname))

  return {
    user,
    displayedNickname,
    isAuthorized,
    avatarId,
    reset: async () => userStore.reset(),
    update: async (payload: Partial<UserData>) => userStore.update(payload)
  }
}
