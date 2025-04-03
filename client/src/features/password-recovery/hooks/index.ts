import { useEffect, useState } from 'react'

import { CodesEndpointsEnum, ICodeValidationPayload, RouteNamesEnum } from 'common-types'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { useApi } from 'src/shared/api'
import { useCounter } from 'src/shared/lib'
import { getNextReqInterval } from 'src/shared/utils'

export const usePasswordRecovery = () => {
  const navigate = useNavigate()
  const { doRequest } = useApi()

  const [emailSendCodeIsLoading, setEmailSendCodeIsLoading] = useState(false)
  const [codeValidationIsLoading, setCodeValidationIsLoading] = useState(false)

  const [codeSent, setCodeAsSent] = useState(false)
  const [counterValue, setCounterValue, startCounter, stopCounter] = useCounter(-1)
  const [queryParam, setQueryParams] = useSearchParams()
  const email = queryParam.get('user-email')

  useEffect(() => {
    const nextTimeRequestFromQuery = Number(queryParam.get('next-time-request'))

    if (nextTimeRequestFromQuery) {
      setCounterValue(Math.round(getNextReqInterval(nextTimeRequestFromQuery)))
      startCounter()
      setCodeAsSent(counterValue > 0)
    }

    return () => {
      stopCounter()
    }
  }, [])

  // const onFinishEmailConfirm = async (fields: FormData) => {
  //   stopCounter()
  //   setEmailSendCodeIsLoading(true)
  //   const response = await doRequest('post', CodesEndpointsEnum.SendEmailCodePasswordRecovery, fields)
  //   setEmailSendCodeIsLoading(false)
  //   setCodeAsSent(true)
  //   if (!response) return
  //   const { nextTimeRequest } = response.data
  //   setQueryParams({ 'next-time-request': nextTimeRequest })
  //   setCounterValue(Math.round(getNextReqInterval(nextTimeRequest)))
  //   startCounter()
  // }

  // const onFinishCodeConfirm = async (fields: { code: string }) => {
  //   setCodeValidationIsLoading(true)
  //   const payload: ICodeValidationPayload = {
  //     email: emailConfirmForm.getFieldValue('email'),
  //     code: fields.code
  //   }
  //   const response = await doRequest('post', CodesEndpointsEnum.ValidateEmailCodePasswordRecovery, payload)
  //   if (!response) return
  //   const { query } = response.data
  //   setCodeValidationIsLoading(false)
  //   navigate({ pathname: RouteNamesEnum.CreateNewPassword, search: `?password-recovery=${query}` })
  // }

  return {
    codeSent,
    counterValue,
    email,
    codeValidationIsLoading,
    emailSendCodeIsLoading
  }
}
