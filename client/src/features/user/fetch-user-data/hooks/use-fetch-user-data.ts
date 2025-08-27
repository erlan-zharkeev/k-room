import { IGetUserDataResponse, UserEndpointsEnum } from 'common-types'

import { useSetUserData } from 'src/features/user'

import { useApi } from 'src/shared/api'

export const useFetchUserData = () => {
  const { doRequest } = useApi()
  const { setUserData } = useSetUserData()

  const fetchUserData = async () => {
    const response = await doRequest<IGetUserDataResponse>('get', UserEndpointsEnum.GetUserData)
    const { data } = response.data
    setUserData(data)
  }

  return { fetchUserData }
}
