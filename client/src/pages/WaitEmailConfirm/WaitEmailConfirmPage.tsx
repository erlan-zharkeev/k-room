import { Status, RouteNames } from 'common-types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useQuery from 'src/hooks/useQuery'
import { AppDispatch } from 'src/store'
import { getNextReqInterval } from 'src/utils/getNextReqInterval'
import useCounter from 'src/hooks/useCounter'
import { AsyncThunkResponseWrapper } from 'src/@types'
import apiMethods from 'src/services/api-methods'
import { UIButton } from 'src/components/UI'

const WaitEmailConfirmPage = () => {
  const navigate = useNavigate()
  const query = useQuery()
  const dispatch = useDispatch<AppDispatch>()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const [remainingAttempts, setRemainingAttempts] = useState(0)

  const [_, refresh] = useState(0)

  const [counter, setCounter, startCounter] = useCounter(0)

  const counterHandler = () => {
    const nextRequestTimestamp = Number(query.get('nextRequestTime'))
    setCounter(getNextReqInterval(nextRequestTimestamp))
    startCounter()
  }

  useEffect(() => {
    setEmail(String(query.get('email')))
    setRemainingAttempts(Number(query.get('attempts')))
    counterHandler()
  }, [_])

  const sendLink = async () => {
    setIsLoading(true)
    const response = (await dispatch(apiMethods.auth.sendConfirmationLink(email))) as AsyncThunkResponseWrapper
    setIsLoading(false)
    const { data, status } = response.payload
    if (status !== Status['success']) return
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
            border="border-default"
            text="Send confirmation link"
            color="accent"
            onClick={sendLink}
            loading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
export default WaitEmailConfirmPage
