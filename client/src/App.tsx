import './styles/App.scss'
import AppRouter from './router/AppRouter'
import { useEffect } from 'react'
import setTheme from './utils/setTheme'
import useTypedSelector from './hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './store'
import { ViewPort } from './store/@types/SystemState'
import { setViewPort } from './store/systemSlice'

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

  const handleResize = () => dispatch(setViewPort(getViewPort()))

  useEffect(() => {
    setTheme(theme)
    const root = document.querySelector('body')
    root?.addEventListener('keydown', onKeyDown)

    window.addEventListener('load', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      root?.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  })

  return <AppRouter />
}

export default App
