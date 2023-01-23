import './styles/App.scss'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import AppRouter from 'src/router/AppRouter'
import { AppDispatch } from 'src/store'
import { getUserData } from 'src/store/userSlice'
import { setViewPort } from 'src/store/systemSlice'
import getCookie from 'src/utils/getCookie'
import setTheme from 'src/utils/setTheme'
import _debounce from 'lodash/debounce'
import clearLocalStorageOnKeyDown from './utils/clearLocalStorageOnKeyDown'
import getViewPort from './utils/getViewPort'

function App(): JSX.Element {
  const { settings } = useTypedSelector((state) => state.persist.system)

  const dispatch = useDispatch<AppDispatch>()
  const fetchUser = async () => await dispatch(getUserData({}))
  const handleResize = () => dispatch(setViewPort(getViewPort()))

  useEffect(() => {
    const accessToken = getCookie('jwt')
    if (accessToken) fetchUser()
    setTheme(settings.theme)
    const root = document.querySelector('body')
    root?.addEventListener('keydown', clearLocalStorageOnKeyDown)

    window.addEventListener('load', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      root?.removeEventListener('keydown', clearLocalStorageOnKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <AppRouter />
}

export default App
