import { useState } from 'react'

import { AuthEndpointsEnum, RouteNamesEnum } from 'common-types'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useResetAllStores } from 'src/features/reset-all-stores'

import { setAuth } from 'src/entities/system'

import { socket, useApi } from 'src/shared/api'
import { clearCookie } from 'src/shared/utils'

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { reset: resetStores } = useResetAllStores(dispatch)
  const [isLoading, setIsLoading] = useState(false)
  const { doRequest } = useApi()

  const logout = async () => {
    setIsLoading(true)
    try {
      await doRequest('post', AuthEndpointsEnum.Logout)
      localStorage.removeItem('logout-status')
    } catch {
      localStorage.setItem('logout-status', 'failed')
    } finally {
      dispatch(setAuth('unauthorized'))
      clearCookie()
      resetStores()
      socket.disconnect()
      navigate(RouteNamesEnum.Login)
      setIsLoading(false)
    }
  }

  return { logout, isLoading }
}
