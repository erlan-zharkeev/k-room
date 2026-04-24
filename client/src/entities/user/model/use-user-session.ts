import { ROUTE_NAMES, type IFrontendUserData } from 'global-shared'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useUser } from './use-user'

export const useUserSession = () => {
  const router = useRouter()
  const { reset, shallowUpdate, user } = useUser()
  const activeUser = computed(() => (user.value.id ? user.value : null))

  const activateUserSession = async (data: IFrontendUserData) => {
    const { email, id, role, username } = data

    await shallowUpdate({ email, id, role, username })
    await router.push(ROUTE_NAMES.main)
  }

  const resetUserSession = async () => {
    await reset()
  }

  return {
    activeUser,
    activateUserSession,
    resetUserSession
  }
}
