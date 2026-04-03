import { useState } from 'react'

import { AUTH_ENDPOINTS, IAuthLoginPayload, ILoginResponse } from 'common'

import { useActivateUserSession } from 'src/features/user'

import { useApi } from 'src/shared/api'

export const useLogin = () => {
  const { doRequest } = useApi()

  const { activateUserSession } = useActivateUserSession()

  const [isLoading, setIsLoading] = useState(false)

  const login = async (fields: IAuthLoginPayload) => {
    setIsLoading(true)
    try {
      const response = await doRequest<ILoginResponse>('post', AUTH_ENDPOINTS.login, fields)
      const payload = response.data.payload
      activateUserSession(payload)
    } catch {
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
