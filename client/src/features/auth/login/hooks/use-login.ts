import { useState } from 'react'

import { AuthEndpointsEnum, IAuthLoginPayload, type ILoginResponse } from 'common-types'

import { useSetUserData } from 'src/features/user'

import { useApi } from 'src/shared/api'

export const useLogin = () => {
  const { doRequest } = useApi()

  const { setUserData } = useSetUserData()

  const [isLoading, setIsLoading] = useState(false)

  const login = async (fields: IAuthLoginPayload) => {
    setIsLoading(true)
    const response = await doRequest<ILoginResponse>('post', AuthEndpointsEnum.Login, fields)
    setIsLoading(false)
    const { data } = response.data
    setUserData(data)
  }

  const onLogin = (payload: unknown) => {
    const formData = payload as IAuthLoginPayload
    login(formData)
  }

  return {
    login,
    isLoading,
    onLogin
  }
}
