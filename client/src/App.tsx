
import './styles/App.scss'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import AppRouter from 'src/router/AppRouter'
import { AppDispatch } from 'src/store'
import { ViewPort } from 'src/store/@types/SystemState'
import { getUserData } from 'src/store/authSlice'
import { setViewPort } from 'src/store/systemSlice'
import getCookie from 'src/utils/getCookie'
import setTheme from 'src/utils/setTheme'

function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>()
  /**
   * Shorthand for clear persisted store cmd + enter
   * @param e KeyBoardEvent
   */
  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.ctrlKey && e.key === 'Enter') {
      localStorage.clear()
      window.location.reload()
      console.log('ls cleared')
    }
  }
  const { theme } = useTypedSelector((state) => state.persist.system)

  function getViewPort(): ViewPort {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height
    }
  }

  const fetchUser = async () => await dispatch(getUserData({}))

  const handleResize = () => dispatch(setViewPort(getViewPort()))

  useEffect(() => {
    const accessToken = getCookie('jwt')
    if (accessToken) fetchUser()
    setTheme(theme)
    const root = document.querySelector('body')
    root?.addEventListener('keydown', onKeyDown)

    window.addEventListener('load', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      root?.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <AppRouter />
}

export default App
