import { IGetUserDataResponse, USER_ENDPOINTS } from 'common'

import { useMainLoader } from 'src/features/switch-main-loader'
import { useActivateUserSession } from 'src/features/user'

import { useApi } from 'src/shared/api'

export const useFetchUserData = () => {
  const { doRequest } = useApi()
  const { activateUserSession } = useActivateUserSession()
  const { switchMainLoader } = useMainLoader()

  const fetchUserData = async () => {
    try {
      const response = await doRequest<IGetUserDataResponse>('get', USER_ENDPOINTS.getUserData)
      const payload = response.data.payload
      activateUserSession(payload)
    } catch {
      //
    } finally {
      switchMainLoader('hide')
    }
  }

  return { fetchUserData }
}
