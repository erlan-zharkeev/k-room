import 'antd/dist/antd.css'
import 'src/styles/main.scss'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Popup, CallModal, ContextMenu } from './components'
import { useNotification, useTypedSelector } from './hooks'
import { AppRouter } from './router/AppRouter'
import { useApi } from './services'
import {
  AppDispatch,
  resetStores,
  changeIsAppLoading,
  commonSetUserDataHandler,
  setViewPort,
  enableAllowAudioContext
} from './store'
import { getViewPort, setTheme, clearLocalStorageOnKeyDown, getCookie } from './utils'
import { UserEndpoints } from 'common-types'
import { $socket, socketReconnect } from './services/$socket'
import { ClientNotificationMessage } from './@enums'

const setRealVh = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--real-1-percent-vh', `${vh}px`)
}


export const App = () => {
  const { theme, soundOn } = useTypedSelector((state) => state.persist.settings)
  const { isAuth } = useTypedSelector((state) => state.user)
  const { allowAudioContext } = useTypedSelector((state) => state.system)
  const notifications = useNotification()
  const { doRequest } = useApi()

  const dispatch = useDispatch<AppDispatch>()
  const fetchUser = async () => {
    const response = await doRequest('get', UserEndpoints.GetUserData)
    if (!response || !response.data) return
    const { userData, settings } = response.data
    if (userData && settings) commonSetUserDataHandler(dispatch, { userData, settings })
    dispatch(changeIsAppLoading(false))
  }

  const handleResize = () => {
    setRealVh()
    dispatch(setViewPort(getViewPort()))
  }

  const networkOfflineNotification = notifications.getNotification({
    message: ClientNotificationMessage.NetworkOffline,
    messageType: 'error'
  })

  const networkOnlineNotification = notifications.getNotification({
    message: ClientNotificationMessage.NetworkOnline,
    messageType: 'info'
  })

  const handleOffline = () => {
    $socket.disconnect()
    networkOfflineNotification.open()
  }

  const handleOnline = () => {
    socketReconnect(dispatch)
    networkOnlineNotification.open()
  }

  const enableAudioInBrowser = () => {
    dispatch(enableAllowAudioContext())
    window.removeEventListener('click', enableAudioInBrowser)
  }

  useEffect(() => {
    if (isAuth) return
    resetStores.forEach((resetStore) => dispatch(resetStore()))
  }, [isAuth])

  const soundContextNotification = notifications.getNotification({
    key: 'sound-context',
    message: ClientNotificationMessage.AllowAudioContext,
    messageType: 'info',
    duration: 0
  })

  useEffect(() => {
    if (allowAudioContext) {
      soundContextNotification.close('sound-context')
    }
  }, [allowAudioContext])

  useEffect(() => {
    setRealVh()
    setTheme(theme)

    if (soundOn && !allowAudioContext) {
      setTimeout(() => {
        if (isAuth) soundContextNotification.open()
      }, 3000)
    }

    const root = document.querySelector('body')
    root?.addEventListener('keydown', clearLocalStorageOnKeyDown)

    window.addEventListener('load', handleResize)
    window.addEventListener('resize', handleResize)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    window.addEventListener('click', enableAudioInBrowser)

    const hasJwt = Boolean(getCookie('jwt'))
    dispatch(changeIsAppLoading(hasJwt))
    if (hasJwt) fetchUser()
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
