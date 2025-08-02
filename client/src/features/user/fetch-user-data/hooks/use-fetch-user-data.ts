import { UserEndpointsEnum } from 'common-types'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { useSetUserData } from 'src/features/user'

import { updateAppLoaderState } from 'src/entities/system'

import { useApi } from 'src/shared/api'

export const useFetchUserData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { doRequest } = useApi()
  const { setUserData } = useSetUserData()

  const fetchUserData = async () => {
    const response = await doRequest('get', UserEndpointsEnum.GetUserData)

    if (!response || !response.data) return
    const { userData } = response.data
    if (userData) setUserData({ userData })
    dispatch(updateAppLoaderState(false))
  }

  return { fetchUserData }
}
