import { USER_ENDPOINTS, type UpdateUserOnboardingPayload, type UserData } from 'global-shared'

import { useHttp } from 'src/shared/api'

import { useUser } from './use-user.model'

export const useUserOnboarding = () => {
  const { doHttpRequest } = useHttp()
  const { update } = useUser()

  const updateUserOnboarding = async (payload: UpdateUserOnboardingPayload) => {
    const response = await doHttpRequest<UserData>('patch', USER_ENDPOINTS.updateUserOnboarding, payload)

    await update(response.data.payload)
  }

  return {
    updateUserOnboarding
  }
}
