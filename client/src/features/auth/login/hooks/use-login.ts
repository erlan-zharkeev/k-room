import { useState } from 'react'

import { AuthEndpointsEnum, IAuthLoginPayload, type ILoginResponse } from 'common'

import { useActivateUserSession } from 'src/features/user'

import { useApi } from 'src/shared/api'

export const useLogin = () => {
  const { doRequest } = useApi()

  const { activateUserSession } = useActivateUserSession()

  const [isLoading, setIsLoading] = useState(false)

  const login = async (fields: IAuthLoginPayload) => {
    setIsLoading(true)
    try {
      const response = await doRequest<ILoginResponse>('post', AuthEndpointsEnum.Login, fields)
      const payload = response.data.payload
      activateUserSession(payload)
    } finally {
      setIsLoading(false)
    }
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
