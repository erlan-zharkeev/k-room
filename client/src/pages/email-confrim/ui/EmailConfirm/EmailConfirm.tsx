import './style.scss'
import { Status, RouteNames, AuthEndpoints } from 'common-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useApi } from 'src/shared/api'
import { Icon, Button } from 'src/shared/ui'
import { AppDispatch } from 'src/app/store'
import { logOut } from 'src/entities/user'
import { useQuery } from 'src/shared/lib'

export const EmailConfirm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const query = useQuery()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { doRequest } = useApi()

  const sendEmailConfirmation = async (id: string) => {
    const response = await doRequest('post', AuthEndpoints.SendEmailConfirmation, { userId: id })
    if (!response) return
    if (response.status !== Status.Success) return navigate(RouteNames.SIGN_IN)
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
            <Icon color="accent" size="large" name="loader" />
          </div>
        ) : (
          <>
            <div className="paragraph-text paragraph-text--secondary">
              Email
              <span className="header-text header-text--sm header-text--accent"> {email} </span>
              confirmed
            </div>
            <Button
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
