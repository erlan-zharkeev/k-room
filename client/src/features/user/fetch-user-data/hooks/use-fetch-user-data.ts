import { IGetUserDataResponse, StatusEnum, UserEndpointsEnum } from 'common-types'

import { useSwitchMainLoader } from 'src/features/switch-main-loader'
import { useActivateUserSession } from 'src/features/user'

import { isApiError, useApi } from 'src/shared/api'

export const useFetchUserData = () => {
  const { doRequest } = useApi()
  const { activateUserSession } = useActivateUserSession()
  const { switchMainLoader } = useSwitchMainLoader()

  const fetchUserData = async () => {
    try {
      const response = await doRequest<IGetUserDataResponse>('get', UserEndpointsEnum.GetUserData)
      const payload = response.data.payload
      activateUserSession(payload)
    } catch (error: unknown) {
      if (isApiError(error) && error.status === StatusEnum.NotAuth) {
        console.warn('No active user session')
        return
      }

      throw error
    } finally {
      switchMainLoader('hide')
    }
  }

  return { fetchUserData }
}
