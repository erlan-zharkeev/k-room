import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { setViewPort } from 'src/entities/system'

import { getViewPort } from 'src/shared/lib'

export const useViewportMonitor = () => {
  const dispatch = useDispatch()

  const setRealVh = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--real-1-percent-vh', `${vh}px`)
  }

  const handleResize = () => {
    setRealVh()
    dispatch(setViewPort(getViewPort()))
  }

  const monitorViewPortChanges = () => {
    setRealVh()
    window.addEventListener('load', handleResize)
    window.addEventListener('resize', handleResize)
  }

  const unsubscribeMonitorViewPortChanges = () => {
    window.removeEventListener('load', handleResize)
    window.removeEventListener('resize', handleResize)
  }

  useEffect(() => {
    monitorViewPortChanges()
    return () => {
      unsubscribeMonitorViewPortChanges()
    }
  }, [])
}
