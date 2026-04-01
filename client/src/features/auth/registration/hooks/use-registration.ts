import { useState } from 'react'

import {
  AuthEndpointsEnum,
  IAuthRegistrationPayload,
  ISendConfirmationLinkResponse,
  RouteNamesEnum,
  StatusEnum
} from 'common'
import { useNavigate } from 'react-router-dom'

import { useApi } from 'src/shared/api'
import { useQuery } from 'src/shared/lib'

type RegistrationFormData = IAuthRegistrationPayload & {
  policy: boolean
}

export const useRegistration = () => {
  const [policySwitch, setPolicySwitch] = useState(false)
  const [policyTouched, setPolicyTouched] = useState(false)

  const navigate = useNavigate()
  const { buildPathWithParams } = useQuery()

  const policySwitchHandler = (e: boolean) => {
    setPolicySwitch(e)
    setPolicyTouched(true)
  }

  const { doRequest } = useApi()
  const [isLoading, setIsLoading] = useState(false)

  const register = async (fields: IAuthRegistrationPayload) => {
    try {
      setIsLoading(true)
      const response = await doRequest<ISendConfirmationLinkResponse>('post', AuthEndpointsEnum.Registration, fields)

      if (!response || response.status !== StatusEnum.Success) return

      const { payload } = response.data

      const pathname = buildPathWithParams(RouteNamesEnum.WaitEmailConfirm, payload)

      navigate(pathname)
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = ({ email, password, username }: RegistrationFormData) => {
    register({ email, password, username })
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
