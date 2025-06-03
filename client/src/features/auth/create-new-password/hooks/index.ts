import { useEffect, useState } from 'react'

import { UserEndpointsEnum, StatusEnum, RouteNamesEnum, ICreateNewPasswordPayload } from 'common-types'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { useApi } from 'src/shared/api'
import { AppFormData } from 'src/shared/ui'

export const useCreateNewPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const [passwordRestoreQuery, setPasswordRestoreQuery] = useState('')
  const [passMatched, setPassMatched] = useState(false)
  const [isFormTouched, setIsFormTouched] = useState(false)
  const [isPasswordChanged, setIPasswordChanged] = useState(false)

  const navigate = useNavigate()
  const { doRequest } = useApi()

  useEffect(() => {
    const currentPasswordRestoreQuery = searchParams.get('password-recovery')
    if (!currentPasswordRestoreQuery) return navigate(RouteNamesEnum.Main)
    setPasswordRestoreQuery(currentPasswordRestoreQuery)
  }, [])

  const checkPassMatch = (payload: AppFormData) => {
    setIsFormTouched(true)
    const { firstPassword, secondPassword } = payload
    const matched = firstPassword === secondPassword
    setPassMatched(matched)
  }

  const onSubmit = async (payload: AppFormData) => {
    try {
      checkPassMatch(payload)
      setIsLoading(true)
      const formData = { password: payload.secondPassword, query: passwordRestoreQuery } as ICreateNewPasswordPayload
      const response = await doRequest('post', UserEndpointsEnum.ResetPassword, formData)
      if (response && response.status === StatusEnum.Success) {
        setIPasswordChanged(true)
      }
    } catch (error: unknown) {
      console.error('Error in create new password:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    passMatched,
    onSubmit,
    checkPassMatch,
    isFormTouched,
    isPasswordChanged
  }
}
