import { isString, ROUTE_NAMES, type UserData } from 'global-shared'
import { useRoute, useRouter } from 'vue-router'

import { allowMediaSync } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'
import { allowAuthRefresh, useSocketConnect } from 'src/shared/api'

export const useClientSession = () => {
  const route = useRoute()
  const router = useRouter()
  const { update } = useUser()
  const { socketConnect } = useSocketConnect()

  const getRedirectPath = () => {
    const { redirect } = route.query

    if (!isString(redirect) || !redirect.startsWith('/') || redirect.startsWith('//')) {
      return ROUTE_NAMES.app
    }

    return redirect
  }

  const activateClientSession = async (data: UserData, shouldRedirect = true) => {
    const { avatarId, email, id, role, nickname, onboarding } = data

    allowAuthRefresh()
    allowMediaSync()
    await update({ avatarId, email, id, role, nickname, onboarding })
    socketConnect()

    if (shouldRedirect) {
      await router.push(getRedirectPath())
    }
  }

  return {
    activateClientSession
  }
}
