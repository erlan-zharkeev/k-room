import { UserEndpointsEnum } from 'common-types'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { updateAppLoaderState } from 'src/entities/system'

import { useApi } from 'src/shared/api'

import { useSetUserData } from '../../set-user-data/hooks/use-set-user-data'

export const useFetchUserData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { doRequest } = useApi()
  const { setUserData } = useSetUserData()

  const fetchUserData = async () => {
    const response = await doRequest('get', UserEndpointsEnum.GetUserData)

    if (!response || !response.data) return
    const { userData, settings } = response.data
    if (userData && settings) setUserData({ userData, settings })
    dispatch(updateAppLoaderState(false))
  }

  return { fetchUserData }
}
