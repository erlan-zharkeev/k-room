import { useDispatch } from 'react-redux'
import { updateAppLoaderState } from 'src/entities/system'
import { useUser } from 'src/entities/user'
import { getCookie } from 'src/shared/utils'

export const useCheckAuth = () => {
  const dispatch = useDispatch()
  const { fetchUser } = useUser()
  const checkAuth = () => {
    const hasJwt = Boolean(getCookie('jwt'))
    dispatch(updateAppLoaderState(hasJwt))
    if (hasJwt) fetchUser()
  }
  return {
    checkAuth
  }
}
