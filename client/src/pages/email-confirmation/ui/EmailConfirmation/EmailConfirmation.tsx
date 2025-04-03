import './style.scss'
import { StatusEnum, RouteNamesEnum, AuthEndpointsEnum } from 'common-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useApi } from 'src/shared/api'
import { AppIcon, AppButton } from 'src/shared/ui'
import { AppDispatch } from 'src/app/store'
import { logOut } from 'src/entities/user'
import { useQuery } from 'src/shared/lib'

export const EmailConfirmation = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const query = useQuery()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { doRequest } = useApi()

  const sendEmailConfirmation = async (id: string) => {
    const response = await doRequest('post', AuthEndpointsEnum.SendEmailConfirmation, { userId: id })
    if (response?.status !== StatusEnum.Success) return navigate(RouteNamesEnum.Login)
    setEmail(response.data.userData.email)
    setIsLoading(false)
    dispatch(logOut())
  }

  useEffect(() => {
    const userId = query.get('userId')
    if (userId) sendEmailConfirmation(userId)
    else navigate(RouteNamesEnum.Login)
  }, [])

  return (
    <div className="email-confirmation">
      <div className="email-confirmation__wrapper">
        <div className="header-text header-text--md header-text--secondary header-text--left">Congratulations</div>
        {isLoading ? (
          <div className="email-confirmation__loader">
            <AppIcon color="accent-color" size="large" name="loader" />
          </div>
        ) : (
          <>
            <div className="paragraph-text ">
              Email
              <span className="header-text header-text--sm header-text--accent"> {email} </span>
              confirmed
            </div>
            <AppButton text="Go to app" onClick={() => navigate(RouteNamesEnum.Login)} />
          </>
        )}
      </div>
    </div>
  )
}
