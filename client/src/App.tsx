import 'antd/dist/antd.css'
import 'src/styles/app.scss'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AsyncThunkResponseWrapper } from './@types'
import { Popup, CallModal, ContextMenu } from 'src/components'
import { useTypedSelector } from 'src/hooks'
import { AppRouter } from 'src/router/AppRouter'
import { AppDispatch } from 'src/store'
import { setViewPort } from 'src/store/system-slice'
import { commonSetUserDataHandler, changeIsAppLoading } from 'src/store/user-slice'
import { getViewPort, setTheme, clearLocalStorageOnKeyDown, getCookie } from 'src/utils'
import { apiMethods } from 'src/services'

export const App = () => {
  const { theme } = useTypedSelector((state) => state.persist.settings)

  const dispatch = useDispatch<AppDispatch>()
  const fetchUser = async () => {
    const response = (await dispatch(apiMethods.user.getUserData({}))) as AsyncThunkResponseWrapper
    if (!response.payload) return
    const { userData, settings } = response.payload?.data
    if (userData && settings) commonSetUserDataHandler(dispatch, { userData, settings })
    dispatch(changeIsAppLoading(false))
  }
  const handleResize = () => dispatch(setViewPort(getViewPort()))

  useEffect(() => {
    setTheme(theme)
    const root = document.querySelector('body')
    root?.addEventListener('keydown', clearLocalStorageOnKeyDown)

    window.addEventListener('load', handleResize)
    window.addEventListener('resize', handleResize)

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
