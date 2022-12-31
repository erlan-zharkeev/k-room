import { Button } from 'antd'
import { AxiosResponse } from 'axios'
import { Status, RouteNames } from 'common-types'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useQuery from 'src/hooks/useQuery'
import { AppDispatch } from 'src/store'
import { sendConfirmationLink } from 'src/store/authSlice'

const getNextReqInterval = (timestamp: number) => (timestamp - Number(Date.now())) / 1000

export const WaitEmailConfirmPage = () => {
  const navigate = useNavigate()
  const query = useQuery()
  const dispatch = useDispatch<AppDispatch>()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const refTimer = useRef(null)
  const [nextReqInterval, setNextReqInterval] = useState(1)
  const [remainingAttempts, setRemainingAttempts] = useState(0)

  const [_, refresh] = useState(0)

  const counterHandler = () => {
    const nextRequestTimestamp = Number(query.get('nextRequestTime'))
    setNextReqInterval(getNextReqInterval(nextRequestTimestamp))
    if (refTimer.current) clearInterval(refTimer.current)
    const id = setInterval(() => {
      setNextReqInterval(getNextReqInterval(nextRequestTimestamp))
    }, 1000)
    refTimer.current = id
  }

  useEffect(() => {
    setEmail(String(query.get('email')))
    setRemainingAttempts(Number(query.get('attempts')))
    counterHandler()
  }, [_])

  const sendLink = async () => {
    setIsLoading(true)
    const response = await dispatch(sendConfirmationLink(email))
    setIsLoading(false)
    const { data, status } = response.payload as AxiosResponse
    if (status !== Status.SUCCESS) return
    const updatedPath = `${RouteNames.WAIT_EMAIL_CONFIRM}?email=${data.email}&nextRequestTime=${data.timeNextRequest}&attempts=${data.attempts}`
    navigate(updatedPath, { replace: true })
    refresh(_ + 1)
  }

  return (
    <div className="page wait-email-confirm">
      <div className="wait-confirm-email__wrapper">
        <div className="header-text header-text--md header-text--accent">Email confirmation</div>
        <div className="paragraph-text paragraph-text--secondary">
          <p>
            A confirmation was sent to the email
            <span className="header-text header-text--sm header-text--accent"> {email}</span>
          </p>
          <p>In order to complete the registration, follow the link provided in the email.</p>
        </div>

        {remainingAttempts <= 0 ? (
          <div className="wait-confirm-email__attempts">
            <div className="paragraph-text paragraph-text--secondary paragraph-text--bold">
              You have exhausted all attempts. Try again later
            </div>
          </div>
        ) : (
          <>
            <div className="wait-confirm-email__attempts">
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

        {nextReqInterval > 0 && (
          <div className="paragraph-text paragraph-text--secondary">
            You can send a confirmation email in {nextReqInterval.toFixed()} seconds
          </div>
        )}

        {nextReqInterval <= 0 && remainingAttempts > 0 && (
          <Button type="primary" block onClick={sendLink} loading={isLoading}>
            Send confirmation link
          </Button>
        )}
      </div>
    </div>
  )
}
export default WaitEmailConfirmPage
