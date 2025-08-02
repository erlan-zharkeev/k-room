import { useState } from 'react'

import { AuthEndpointsEnum, AuthLoginPayloadType, StatusEnum, RouteNamesEnum } from 'common-types'
import { useNavigate } from 'react-router-dom'

import { useSetUserData } from 'src/features/user'

import { useApi } from 'src/shared/api'

export const useLogin = () => {
  const { doRequest } = useApi()
  const { setUserData } = useSetUserData()

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const login = async (fields: AuthLoginPayloadType) => {
    setIsLoading(true)
    const response = await doRequest('post', AuthEndpointsEnum.Login, fields)
    setIsLoading(false)
    if (response?.status === StatusEnum.Success && response.data) {
      const { userData } = response.data
      setUserData({ userData })
      navigate(RouteNamesEnum.Main)
    }
  }

  const onLogin = (payload: unknown) => {
    const formData = payload as AuthLoginPayloadType
    login(formData)
  }

  return {
    login,
    isLoading,
    onLogin
  }
}
