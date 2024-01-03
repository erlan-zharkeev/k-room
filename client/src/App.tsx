import 'antd/dist/antd.css'
import 'src/styles/main.scss'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AsyncThunkResponseWrapper } from './@types'
import { Popup, CallModal, ContextMenu } from './components'
import { useTypedSelector } from './hooks'
import { AppRouter } from './router/AppRouter'
import { apiMethods } from './services'
import { AppDispatch, changeIsAppLoading, commonSetUserDataHandler, setViewPort, showNotification } from './store'
import { getViewPort, setTheme, clearLocalStorageOnKeyDown, getCookie } from './utils'
import { NotificationMessage, NotificationType } from 'common-types'
import { $socket, socketReconnect } from './services/$socket'

export const App = () => {
  const { theme } = useTypedSelector((state) => state.persist.settings)

  const dispatch = useDispatch<AppDispatch>()
  const fetchUser = async () => {
    const response = (await dispatch(apiMethods.user.getUserData())) as AsyncThunkResponseWrapper
    if (!response.payload) return
    const { userData, settings } = response.payload?.data
    if (userData && settings) commonSetUserDataHandler(dispatch, { userData, settings })
    dispatch(changeIsAppLoading(false))
  }
  const handleResize = () => dispatch(setViewPort(getViewPort()))
  const handleOffline = () => {
    $socket.disconnect()
    dispatch(
      showNotification({
        message: NotificationMessage.networkOffline,
        messageType: NotificationType.error,
        duration: 5000
      })
    )
  }
  const handleOnline = () => {
    socketReconnect(dispatch)
    dispatch(
      showNotification({
        message: NotificationMessage.networkOnline,
        messageType: NotificationType.info
      })
    )
  }

  useEffect(() => {
    setTheme(theme)
    const root = document.querySelector('body')
    root?.addEventListener('keydown', clearLocalStorageOnKeyDown)

    window.addEventListener('load', handleResize)
    window.addEventListener('resize', handleResize)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const hasJwt = Boolean(getCookie('jwt'))
    dispatch(changeIsAppLoading(hasJwt))
    if (hasJwt) fetchUser()

    return () => {
      root?.removeEventListener('keydown', clearLocalStorageOnKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <Popup />
      <CallModal />
      <AppRouter />
      <ContextMenu />
    </>
  )
}
