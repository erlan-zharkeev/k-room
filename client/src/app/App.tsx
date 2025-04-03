import 'src/shared/config/styles'
import { useEffect } from 'react'

import { useCheckAuth } from 'src/features/auth'
import { useAudioContextMonitor } from 'src/features/monitor-audio-context'
import { useNetworkMonitor } from 'src/features/monitor-network/hooks'
import { useViewportMonitor } from 'src/features/monitor-viewport'
import { useThemeUpdate } from 'src/features/update-theme'

import { Router } from './router'

export const App = () => {
  const { setTheme } = useThemeUpdate()

  useAudioContextMonitor()
  useNetworkMonitor()
  useViewportMonitor()
  useCheckAuth()

  useEffect(() => {
    setTheme()
  }, [])

  return <Router />
}
