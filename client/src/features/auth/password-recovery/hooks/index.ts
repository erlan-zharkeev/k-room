import { useEffect, useState } from 'react'

import { CodesEndpointsEnum, ICodeValidationPayload, RouteNamesEnum } from 'common'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { getHandledErrorMessage, useApi } from 'src/shared/api'
import { useCounter, useQuery } from 'src/shared/lib'
import { AppFormData } from 'src/shared/ui'
import { clg, getNextReqInterval } from 'src/shared/utils'

export const usePasswordRecovery = () => {
  const navigate = useNavigate()
  const { doRequest } = useApi()
  const { buildPathWithParams } = useQuery()
  const [queryParam, setQueryParams] = useSearchParams()
  const [email, setEmail] = useState(queryParam.get('user-email') ?? '')
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

  const sendEmailCodeToPasswordRecovery = async (fields?: AppFormData) => {
    try {
      const nextEmail = typeof fields?.email === 'string' ? fields.email.trim() : email.trim()
      if (!nextEmail) return

      stopCounter()
      setEmailSendCodeIsLoading(true)
      const response = await doRequest('post', CodesEndpointsEnum.SendEmailCodePasswordRecovery, { email: nextEmail })
      if (!response) return
      setEmail(nextEmail)
      setCodeAsSent(true)
      const { nextTimeRequest } = response.data.payload as { nextTimeRequest: number }

      setQueryParams((prev) => {
        const params = new URLSearchParams(prev)
        params.set('user-email', nextEmail)
        params.set('next-time-request', String(nextTimeRequest))
        return params
      })

      setCounterValue(Math.round(getNextReqInterval(nextTimeRequest)))
      startCounter()
    } catch (error: unknown) {
      clg('error', getHandledErrorMessage(error))
    } finally {
      setEmailSendCodeIsLoading(false)
    }
  }

  const validateCodeToRecoveryPassword = async (fields: AppFormData) => {
    try {
      const { code } = fields as { code: string }
      setCodeValidationIsLoading(true)
      const payload: ICodeValidationPayload = {
        email: email.trim(),
        code
      }
      const response = await doRequest('post', CodesEndpointsEnum.ValidateEmailCodePasswordRecovery, payload)
      if (!response) return
      const { query } = response.data.payload as { query: string }
      const pathname = buildPathWithParams(RouteNamesEnum.CreateNewPassword, { 'password-recovery': query })
      navigate({ pathname })
    } catch (error: unknown) {
      clg('error', getHandledErrorMessage(error))
    } finally {
      setCodeValidationIsLoading(false)
    }
  }

  return {
    codeSent,
    counterValue,
    email,
    codeValidationIsLoading,
    hasPresetEmail: Boolean(queryParam.get('user-email')),
    emailSendCodeIsLoading,
    sendEmailCodeToPasswordRecovery,
    validateCodeToRecoveryPassword
  }
}
