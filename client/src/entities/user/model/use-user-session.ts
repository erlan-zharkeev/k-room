import { ROUTE_NAMES, type IFrontendUserData } from 'global-shared'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useResetClientData } from 'src/features/client-session'
import { socket, useSocketConnect } from 'src/shared/api'
import { clearCookie } from 'src/shared/lib'

import { useUser } from './use-user'

export const useUserSession = () => {
  const route = useRoute()
  const router = useRouter()
  const { shallowUpdate, user } = useUser()
  const { socketConnect } = useSocketConnect()
  const { resetClientData } = useResetClientData()

  const activeUser = computed(() => (user.value.id ? user.value : null))

  const getRedirectPath = () => {
    const { redirect } = route.query

    if (typeof redirect !== 'string' || !redirect.startsWith('/') || redirect.startsWith('//')) {
      return ROUTE_NAMES.app
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

  const resetClientSession = async () => {
    await resetClientData()
    clearCookie()
    socket.disconnect()
    await router.push(ROUTE_NAMES.authLogin)
  }

  return {
    activeUser,
    activateUserSession,
    resetClientSession
  }
}
