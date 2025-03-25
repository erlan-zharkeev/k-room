import { UserEndpoints, Status, RouteNames, ICreateNewPasswordPayload } from 'common-types'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApi } from 'src/shared/api'
import { AppFormData } from 'src/shared/ui'

export const useCreateNewPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const [passwordRestoreQuery, setPasswordRestoreQuery] = useState('')
  const [passMatched, setPassMatched] = useState(false)

  const navigate = useNavigate()
  const { doRequest } = useApi()

  useEffect(() => {
    const currentPasswordRestoreQuery = searchParams.get('password-recovery')
    if (!currentPasswordRestoreQuery) return navigate(RouteNames.Main)
    setPasswordRestoreQuery(currentPasswordRestoreQuery)
  })

  const checkPassMatch = (payload: AppFormData) => {
    const { firstPassword, secondPassword } = payload
    const matched = firstPassword === secondPassword
    setPassMatched(matched)
    if (!matched) return
  }

  const onSubmit = async (payload: AppFormData) => {
    checkPassMatch(payload)

    setIsLoading(true)
    const formData = { ...payload, query: passwordRestoreQuery } as ICreateNewPasswordPayload
    const response = await doRequest('post', UserEndpoints.ResetPassword, formData)
    setIsLoading(false)
    if (response && response.status === Status.Success) navigate(RouteNames.Login)
  }

  return {
    isLoading,
    passMatched,
    onSubmit
  }
}
