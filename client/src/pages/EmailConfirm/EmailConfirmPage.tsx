import { Status, RouteNames, AuthEndpoints } from 'common-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { UIIcon, UIButton } from 'src/components'
import { useQuery } from 'src/hooks'
import { useApi } from 'src/services'
import { AppDispatch, logOut } from 'src/store'

export const EmailConfirmPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const query = useQuery()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { doRequest } = useApi()

  const sendEmailConfirmation = async (id: string) => {
    const response = await doRequest('post', AuthEndpoints.SEND_EMAIL_CONFIRMATION, { userId: id })
    if (!response) return
    if (response.status !== Status.success) return navigate(RouteNames.SIGN_IN)
    setEmail(response.data.userData.email)
    setIsLoading(false)
    dispatch(logOut())
  }

  useEffect(() => {
    const userId = query.get('userId')
    if (userId) sendEmailConfirmation(userId)
    else navigate(RouteNames.SIGN_IN)
  }, [])

  return (
    <div className="page confirmed-email">
      <div className="confirmed-email__wrapper">
        <div className="header-text header-text--md header-text--secondary header-text--left">Congratulations</div>
        {isLoading ? (
          <div className="confirmed-email__loader">
            <UIIcon color="accent" size="large" name="loader" />
          </div>
        ) : (
          <>
            <div className="paragraph-text paragraph-text--secondary">
              Email
              <span className="header-text header-text--sm header-text--accent"> {email} </span>
              confirmed
            </div>
            <UIButton
              color="accent"
              fill
              text="Go to app"
              border="common-border"
              onClick={() => navigate(RouteNames.SIGN_IN)}
            />
          </>
        )}
      </div>
    </div>
  )
}
