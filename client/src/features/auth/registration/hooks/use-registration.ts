import { useState } from 'react'

import { AuthEndpointsEnum, IAuthRegistrationPayload, RouteNamesEnum } from 'common-types'
import { useNavigate } from 'react-router-dom'

import { useApi } from 'src/shared/api'

export const useRegistration = () => {
  const [policySwitch, setPolicySwitch] = useState(false)
  const [policyTouched, setPolicyTouched] = useState(false)

  const navigate = useNavigate()

  const policySwitchHandler = (e: boolean) => {
    setPolicySwitch(e)
    setPolicyTouched(true)
  }

  const { doRequest } = useApi()
  const [isLoading, setIsLoading] = useState(false)

  const register = async (fields: IAuthRegistrationPayload) => {
    setIsLoading(true)
    await doRequest('post', AuthEndpointsEnum.Registration, fields)
    setIsLoading(false)
    navigate(RouteNamesEnum.Login)
  }

  const onRegister = (payload: unknown) => {
    const formData = payload as IAuthRegistrationPayload
    register(formData)
  }

  return {
    policySwitch,
    policyTouched,
    policySwitchHandler,
    register,
    isLoading,
    onRegister
  }
}
