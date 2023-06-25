import 'antd/dist/antd.css'
import './styles/App.scss'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import AppRouter from 'src/router/AppRouter'
import { AppDispatch } from 'src/store'
import { setViewPort } from 'src/store/systemSlice'
import getCookie from 'src/utils/getCookie'
import setTheme from 'src/utils/setTheme'
import clearLocalStorageOnKeyDown from './utils/clearLocalStorageOnKeyDown'
import getViewPort from './utils/getViewPort'
import apiMethods from './services/api-methods'
import { changeIsAppLoading, commonSetUserDataHandler } from './store/userSlice'
import { AsyncThunkResponseWrapper } from './@types'
import ContextMenu from 'src/components/Common/ContextMenu/ContextMenu'

const App = () => {
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
      <AppRouter />
      <ContextMenu />
    </>
  )
}

export default App
