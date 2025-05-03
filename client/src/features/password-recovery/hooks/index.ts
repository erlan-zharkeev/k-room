import { useEffect, useState } from 'react'

import { CodesEndpointsEnum, ICodeValidationPayload, RouteNamesEnum } from 'common-types'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { useApi } from 'src/shared/api'
import { useCounter } from 'src/shared/lib'
import { AppFormData } from 'src/shared/ui'
import { getNextReqInterval } from 'src/shared/utils'

export const usePasswordRecovery = () => {
  const navigate = useNavigate()
  const { doRequest } = useApi()

  const [queryParam, setQueryParams] = useSearchParams()
  const [email] = useState(queryParam.get('user-email') ?? '')
  const [emailSendCodeIsLoading, setEmailSendCodeIsLoading] = useState(false)
  const [codeValidationIsLoading, setCodeValidationIsLoading] = useState(false)
  const [codeSent, setCodeAsSent] = useState(false)

  const [counterValue, setCounterValue, startCounter, stopCounter] = useCounter(0)

  useEffect(() => {
    const nextTimeRequestFromQuery = Number(queryParam.get('next-time-request'))

    if (nextTimeRequestFromQuery) {
      setCounterValue(Math.round(getNextReqInterval(nextTimeRequestFromQuery)))
      startCounter()
    }

    return () => {
      stopCounter()
    }
  }, [])

  useEffect(() => {
    if (counterValue <= 0) {
      stopCounter()
    }
  }, [counterValue])

  const sendEmailCodeToPasswordRecovery = async () => {
    try {
      stopCounter()
      setEmailSendCodeIsLoading(true)
      const response = await doRequest('post', CodesEndpointsEnum.SendEmailCodePasswordRecovery, { email })
      if (!response) return
      setCodeAsSent(true)
      const { nextTimeRequest } = response.data

      setQueryParams((prev) => {
        const params = new URLSearchParams(prev)
        params.set('next-time-request', String(nextTimeRequest))
        return params
      })

      setCounterValue(Math.round(getNextReqInterval(nextTimeRequest)))
      startCounter()
    } catch (error) {
      console.error(error)
    } finally {
      setEmailSendCodeIsLoading(false)
    }
  }

  const validateCodeToRecoveryPassword = async (fields: AppFormData) => {
    try {
      const { code } = fields as { code: string }
      setCodeValidationIsLoading(true)
      const payload: ICodeValidationPayload = {
        email,
        code
      }
      const response = await doRequest('post', CodesEndpointsEnum.ValidateEmailCodePasswordRecovery, payload)
      if (!response) return
      const { query } = response.data
      navigate({ pathname: RouteNamesEnum.CreateNewPassword, search: `?password-recovery=${query}` })
    } catch (error) {
      console.error(error)
    } finally {
      setCodeValidationIsLoading(false)
    }
  }

  return {
    codeSent,
    counterValue,
    email,
    codeValidationIsLoading,
    emailSendCodeIsLoading,
    sendEmailCodeToPasswordRecovery,
    validateCodeToRecoveryPassword
  }
}
