import { RouteNamesEnum } from 'common-types'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useResetAllStores } from 'src/features/reset-all-stores'

import { socket } from 'src/shared/api'
import { clearCookie } from 'src/shared/utils'

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { reset } = useResetAllStores(dispatch)

  const logout = () => {
    navigate(RouteNamesEnum.Login)
    clearCookie()
    reset()
    socket.disconnect()
  }

  return { logout }
}
