import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { logOut, sendEmailConfirm } from '../../store/authSlice'
import { RouteNames, Status } from 'k-room.types'
import { AxiosResponse } from 'axios'
import useQuery from '../../hooks/useQuery'
import useTypedSelector from '../../hooks/useTypedSelector'
import { socket } from '../../socket/socket'

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
    socket.disconnect()
    // setTimeout(() => {
    //   navigate(RouteNames.SIGN_IN)
    // }, 5000)
  }

  useEffect(() => {
    const userId = query.get('userId')
    if (userId) sendEmailConfirmation(userId)
    else navigate(RouteNames.SIGN_IN)
  }, [])

  return (
    <div className="page confirmed-email">
      <div className="confirmed-email__wrapper">
        <div className="header-text header-text--md header-text--accent">Email confirmation</div>
        {isLoading ? (
          <div className="confirmed-email__loader">
            <LoadingOutlined style={{ fontSize: '40px', color: 'rgb(65 139 237)', marginLeft: '12px' }} />
          </div>
        ) : (
          <>
            <div className="paragraph-text paragraph-text--secondary">
              Email
              <span className="header-text header-text--sm header-text--accent"> {email} </span>
              confirmed
            </div>
            <Button type="primary" block onClick={() => navigate(RouteNames.SIGN_IN)}>
              Go to app
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
export default EmailConfirmPage
