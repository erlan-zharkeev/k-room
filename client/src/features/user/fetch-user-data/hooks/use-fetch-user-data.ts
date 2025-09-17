import { IGetUserDataResponse, UserEndpointsEnum } from 'common-types'

import { useSwitchMainLoader } from 'src/features/switch-main-loader'
import { useActivateUserSession } from 'src/features/user'

import { useApi } from 'src/shared/api'

export const useFetchUserData = () => {
  const { doRequest } = useApi()
  const { activateUserSession } = useActivateUserSession()
  const { switchMainLoader } = useSwitchMainLoader()

  const fetchUserData = async () => {
    try {
      const response = await doRequest<IGetUserDataResponse>('get', UserEndpointsEnum.GetUserData)
      const { data } = response.data
      activateUserSession(data)
    } finally {
      switchMainLoader('hide')
    }
  }

  return { fetchUserData }
}
