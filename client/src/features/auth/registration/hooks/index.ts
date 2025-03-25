import { AuthEndpoints, AuthRegistrationPayload, RouteNames, Status } from 'common-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { commonSetUserDataHandler } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { useNavigate } from 'react-router-dom'

export const useRegistration = () => {
  const [policySwitch, setPolicySwitch] = useState(false)
  const [policyTouched, setPolicyTouched] = useState(false)
  const navigate = useNavigate()

  const policySwitchHandler = (e: boolean) => {
    setPolicySwitch(e)
    setPolicyTouched(true)
  }

  const { doRequest } = useApi()
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)

  const register = async (fields: AuthRegistrationPayload) => {
    setIsLoading(true)
    const response = await doRequest('post', AuthEndpoints.Registration, fields)
    setIsLoading(false)
    if (response?.status === Status.Success && response.data) {
      const { userData, settings } = response.data
      commonSetUserDataHandler(dispatch, { userData, settings })
      navigate(RouteNames.Login)
    }
  }

  return {
    policySwitch,
    policyTouched,
    policySwitchHandler,
    register,
    isLoading
  }
}
