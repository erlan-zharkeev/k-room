import { useState } from 'react'

import { AuthEndpointsEnum, RouteNamesEnum } from 'common'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useResetAllStores } from 'src/features/reset-all-stores'

import { setAuth } from 'src/entities/system'

import { socket, useApi } from 'src/shared/api'
import { LOCAL_STORAGE_KEY } from 'src/shared/config'
import { clearCookie } from 'src/shared/lib'

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
      localStorage.removeItem(LOCAL_STORAGE_KEY.LogoutStatus)
    } catch {
      localStorage.setItem(LOCAL_STORAGE_KEY.LogoutStatus, 'failed')
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
