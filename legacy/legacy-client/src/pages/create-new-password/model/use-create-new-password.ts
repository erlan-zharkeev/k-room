import { useEffect, useState } from 'react'

import { useSearchParams, useNavigate } from 'react-router-dom'

import { USER_ENDPOINTS, REQ_STATUS, ROUTE_NAMES, CreateNewPasswordPayload } from 'common'

import { useApi } from 'src/shared/api'
import { AppFormData } from 'src/shared/ui'

export const useCreateNewPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const [passwordRestoreCode, setPasswordRestoreCode] = useState('')
  const [passMatched, setPassMatched] = useState(false)
  const [isFormTouched, setIsFormTouched] = useState(false)
  const [isPasswordChanged, setIsPasswordChanged] = useState(false)

  const navigate = useNavigate()
  const { doRequest } = useApi()

  useEffect(() => {
    const currentPasswordRestoreQuery = searchParams.get('password-recovery')
    if (!currentPasswordRestoreQuery) return navigate(ROUTE_NAMES.main)
    setPasswordRestoreCode(currentPasswordRestoreQuery)
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
      const password = typeof payload.secondPassword === 'string' ? payload.secondPassword : ''
      const formData: CreateNewPasswordPayload = {
        password,
        codeToValidate: passwordRestoreCode
      }
      const response = await doRequest('post', USER_ENDPOINTS.resetPassword, formData)
      if (response && response.status === REQ_STATUS.success) {
        setIsPasswordChanged(true)
      }
    } catch {
      //
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
