import { ROUTE_NAMES, type IFrontendUserData } from 'global-shared'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useSocketConnect } from 'src/shared/api'

import { useUser } from './use-user'

export const useUserSession = () => {
  const route = useRoute()
  const router = useRouter()
  const { reset, shallowUpdate, user } = useUser()
  const { socketConnect } = useSocketConnect()
  const activeUser = computed(() => (user.value.id ? user.value : null))

  const getRedirectPath = () => {
    const { redirect } = route.query

    if (typeof redirect !== 'string' || !redirect.startsWith('/') || redirect.startsWith('//')) {
      return ROUTE_NAMES.main
    }

    return redirect
  }

  const activateUserSession = async (data: IFrontendUserData, shouldRedirect = true) => {
    const { email, id, role, username } = data

    await shallowUpdate({ email, id, role, username })
    socketConnect()

    if (shouldRedirect) {
      await router.push(getRedirectPath())
    }
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
