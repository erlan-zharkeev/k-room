import { Status, RouteNames, AuthEndpoints } from 'common-types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UIButton } from 'src/components'
import { useQuery, useCounter } from 'src/hooks'
import { useApi } from 'src/services'
import { getNextReqInterval } from 'src/utils'

export const WaitEmailConfirmPage = () => {
  const navigate = useNavigate()
  const query = useQuery()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const [remainingAttempts, setRemainingAttempts] = useState(0)

  const [_, refresh] = useState(0)

  const [counter, setCounter, startCounter, stopCounter] = useCounter(0)
  const { doRequest } = useApi()

  const counterHandler = () => {
    const nextRequestTimestamp = Number(query.get('nextRequestTime'))
    setCounter(getNextReqInterval(nextRequestTimestamp))
    startCounter()
  }

  useEffect(() => {
    setEmail(String(query.get('email')))
    setRemainingAttempts(Number(query.get('attempts')))
    counterHandler()
    return () => {
      stopCounter()
    }
  }, [_])

  const sendLink = async () => {
    setIsLoading(true)
    const response = await doRequest('post', AuthEndpoints.SEND_EMAIL_CONFIRMATION_LINK, { email })
    setIsLoading(false)
    if (!response || response.status !== Status.success) return
    const { data } = response
    const updatedPath = `${RouteNames.WAIT_EMAIL_CONFIRM}?email=${data.email}&nextRequestTime=${data.timeNextRequest}&attempts=${data.attempts}`
    navigate(updatedPath, { replace: true })
    refresh(_ + 1)
  }

  return (
    <div className="page wait-email-confirm">
      <div className="wait-confirm-email__wrapper">
        <div className="header-text header-text--md header-text--accent">Email confirmation</div>
        <p className="paragraph-text paragraph-text--secondary">
          A confirmation was sent to the email
          <span className="header-text header-text--sm header-text--accent"> {email}</span>
        </p>
        <p className="paragraph-text paragraph-text--secondary">
          In order to complete the registration, follow the link provided in the email.
        </p>

        {remainingAttempts <= 0 ? (
          <div className="wait-email-confirm__attempts">
            <div className="paragraph-text paragraph-text--secondary paragraph-text--bold">
              You have exhausted all attempts. Try again later
            </div>
          </div>
        ) : (
          <>
            <div className="wait-email-confirm__attempts">
              <div className="paragraph-text paragraph-text--secondary paragraph-text--bold">Attempts left:</div>
              <div className="paragraph-text paragraph-text--accent paragraph-text--bold">
                &nbsp;{remainingAttempts}
              </div>
            </div>
            <div className="paragraph-text paragraph-text--secondary wait-confirm-email__not-received">
              If the email does not arrive, try to resend the request
            </div>
          </>
        )}

        {counter > 0 && (
          <div className="paragraph-text paragraph-text--secondary wait-email-confirm__counter">
            You can send a confirmation email in {Math.round(counter)} seconds
          </div>
        )}

        {counter <= 0 && remainingAttempts > 0 && (
          <UIButton
            border="common-border"
            text="Send confirmation link"
            color="accent"
            onClick={sendLink}
            loading={isLoading}
          />
        )}
        <UIButton
          border="common-border"
          text="Back to app"
          color="accent"
          onClick={() => navigate(RouteNames.SIGN_IN)}
        />
      </div>
    </div>
  )
}
