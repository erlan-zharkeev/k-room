import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  AUTH_ENDPOINTS,
  IAuthRegistrationPayload,
  ISendConfirmationLinkResponse,
  ROUTE_NAMES,
  REQ_STATUS
} from 'common'

import { useApi } from 'src/shared/api'
import { useQuery } from 'src/shared/lib'

import { RegistrationFormDataType } from './types'

export const useRegistration = () => {
  const [policySwitch, setPolicySwitch] = useState(false)
  const [policyTouched, setPolicyTouched] = useState(false)

  const navigate = useNavigate()
  const { buildPathWithParams } = useQuery()
  const { doRequest } = useApi()
  const [isLoading, setIsLoading] = useState(false)

  const policySwitchHandler = (value: boolean) => {
    setPolicySwitch(value)
    setPolicyTouched(true)
  }

  const register = async (fields: IAuthRegistrationPayload) => {
    try {
      setIsLoading(true)
      const response = await doRequest<ISendConfirmationLinkResponse>('post', AUTH_ENDPOINTS.registration, fields)

      if (!response || response.status !== REQ_STATUS.success) return

      const { payload } = response.data
      const pathname = buildPathWithParams(ROUTE_NAMES.waitEmailConfirm, payload)
      navigate(pathname)
    } catch {
      //
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = ({ email, password, username }: RegistrationFormDataType) => {
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
