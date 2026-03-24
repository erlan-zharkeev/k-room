import './style.scss'
import { useState, useEffect } from 'react'

import { StatusEnum, RouteNamesEnum, AuthEndpointsEnum, ISendConfirmationLinkResponse } from 'common-types'
import { useNavigate } from 'react-router-dom'

import { useApi } from 'src/shared/api'
import { useQuery, useCounter } from 'src/shared/lib'
import { AppButton } from 'src/shared/ui'
import { getNextReqInterval } from 'src/shared/utils'

export const WaitEmailConfirm = () => {
  const navigate = useNavigate()
  const query = useQuery()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const [remainingAttempts, setRemainingAttempts] = useState(0)

  const [_, refresh] = useState(0)

  const [counter, setCounter, startCounter, stopCounter] = useCounter(0)
  const { doRequest } = useApi()

  const counterHandler = () => {
    const nextRequestTimestamp = Number(query.value.get('nextRequestTime'))
    setCounter(getNextReqInterval(nextRequestTimestamp))
    startCounter()
  }

  useEffect(() => {
    setEmail(String(query.value.get('email')))
    setRemainingAttempts(Number(query.value.get('attempts')))
    counterHandler()
    return () => {
      stopCounter()
    }
  }, [_])

  const sendLink = async () => {
    setIsLoading(true)
    const response = await doRequest<ISendConfirmationLinkResponse>(
      'post',
      AuthEndpointsEnum.SendEmailConfirmationLink,
      { email }
    )
    setIsLoading(false)
    if (!response || response.status !== StatusEnum.Success) return
    const payload = response.data.payload

    const updatedPath = query.buildPathWithParams(RouteNamesEnum.WaitEmailConfirm, {
      email: payload.email,
      nextRequestTime: payload.nextRequestTime,
      attempts: payload.attempts
    })

    navigate(updatedPath, { replace: true })
    refresh(_ + 1)
  }

  return (
    <div className="wait-email-confirm">
      <div className="wait-confirm-email__wrapper">
        <div className="wait-email-confirm__header">Email confirmation</div>
        <p className="paragraph-text">
          A confirmation was sent to your email
          {email && <span> {email}</span>}
        </p>
        <p className="paragraph-text">In order to complete the registration, follow the link provided in the email.</p>
        {remainingAttempts <= 0 ? (
          <div className="wait-email-confirm__attempts">
            <div className="paragraph-text  paragraph-text--bold">You have exhausted all attempts. Try again later</div>
          </div>
        ) : (
          <>
            <div className="wait-email-confirm__attempts">
              <div className="paragraph-text  paragraph-text--bold">Attempts left:</div>
              <div className="paragraph-text paragraph-text--accent paragraph-text--bold">
                &nbsp;{remainingAttempts}
              </div>
            </div>
            <div className="paragraph-text  wait-confirm-email__not-received">
              If the email does not arrive, try to resend the request
            </div>
          </>
        )}

        {counter > 0 && (
          <div className="paragraph-text  wait-email-confirm__counter">
            You can send a confirmation email in {Math.round(counter)} seconds
          </div>
        )}

        <div className="wait-email-confirm__actions">
          {counter <= 0 && remainingAttempts > 0 && (
            <AppButton text="Send confirmation link" color="accent-color" onClick={sendLink} loading={isLoading} />
          )}
          <AppButton text="Back to app" color="accent-color" onClick={() => navigate(RouteNamesEnum.Login)} />
        </div>
      </div>
    </div>
  )
}
