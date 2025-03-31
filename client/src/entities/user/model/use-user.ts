import { UserEndpointsEnum } from 'common-types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { updateAppLoaderState } from 'src/entities/system'
import { useApi } from 'src/shared/api'
import { useTypedSelector } from 'src/shared/lib'
import { commonSetUserDataHandler } from './user-slice'

export const useUser = () => {
  const { userData, isAuth } = useTypedSelector((state) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const { doRequest } = useApi()

  const fetchUser = async () => {
    const response = await doRequest('get', UserEndpointsEnum.GetUserData)
    if (!response || !response.data) return
    const { userData, settings } = response.data
    if (userData && settings) commonSetUserDataHandler(dispatch, { userData, settings })
    dispatch(updateAppLoaderState(false))
  }

  return {
    ...userData,
    isAuth,
    fetchUser
  }
}
