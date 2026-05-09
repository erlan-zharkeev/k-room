import { ROUTE_NAMES, type IFrontendUserData } from 'global-shared'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useSocketConnect } from 'src/shared/api'

import { useUser } from './use-user.model'

export const useUserSession = () => {
  const route = useRoute()
  const router = useRouter()
  const { update, user } = useUser()
  const { socketConnect } = useSocketConnect()

  const activeUser = computed(() => (user.value.id ? user.value : null))

  const getRedirectPath = () => {
    const { redirect } = route.query

    if (typeof redirect !== 'string' || !redirect.startsWith('/') || redirect.startsWith('//')) {
      return ROUTE_NAMES.app
    }

    return redirect
  }

  const activateUserSession = async (data: IFrontendUserData, shouldRedirect = true) => {
    const { email, id, role, nickname } = data

    await update({ email, id, role, nickname })
    socketConnect()

    if (shouldRedirect) {
      await router.push(getRedirectPath())
    }
  }

  return {
    activeUser,
    activateUserSession
  }
}
