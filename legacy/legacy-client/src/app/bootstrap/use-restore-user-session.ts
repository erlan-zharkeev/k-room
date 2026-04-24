import { IGetUserDataResponse, USER_ENDPOINTS } from 'common'

import { useActivateUserSession } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { useMainLoader } from 'src/shared/system'

export const useRestoreUserSession = () => {
  const { doRequest } = useApi()
  const { activateUserSession } = useActivateUserSession()
  const { switchMainLoader } = useMainLoader()

  const fetchUserData = async () => {
    try {
      const response = await doRequest<IGetUserDataResponse>('get', USER_ENDPOINTS.getUserData)
      const payload = response.data.payload
      await activateUserSession(payload)
    } finally {
      switchMainLoader('hide')
    }
  }

  return { fetchUserData }
}
