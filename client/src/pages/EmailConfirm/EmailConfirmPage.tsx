import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AxiosResponse } from 'axios'
import { Status, RouteNames } from 'common-types'
import useQuery from 'src/hooks/useQuery'
import { AppDispatch } from 'src/store'
import { logOut } from 'src/store/userSlice'
import { sendEmailConfirm } from 'src/store/authSlice'
import UIButton from 'ui/UIButton'
import UIIcon from 'ui/UIIcon'

export const EmailConfirmPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const query = useQuery()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const sendEmailConfirmation = async (id: string) => {
    const response = await dispatch(sendEmailConfirm(id))
    const { status, data } = response.payload as AxiosResponse
    if (status !== Status.SUCCESS) return navigate(RouteNames.SIGN_IN)
    setEmail(data.userData.email)
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
            <UIButton color="accent" borderless={false} text="Go to app" onClick={() => navigate(RouteNames.SIGN_IN)} />
          </>
        )}
      </div>
    </div>
  )
}
export default EmailConfirmPage
