import 'src/shared/config/styles'
import { useEffect } from 'react'

import { useCheckAuth } from 'src/features/auth'
import { useNetworkMonitor } from 'src/features/monitor-network/hooks'
import { useViewportMonitor } from 'src/features/monitor-viewport'
import { useThemeUpdate } from 'src/features/settings/update-theme'

import { useSettings } from 'src/entities/settings'

import { Router } from './router'

export const App = () => {
  const { theme } = useSettings()
  const { setTheme } = useThemeUpdate()
  useNetworkMonitor()
  useViewportMonitor()
  useCheckAuth()

  useEffect(() => {
    setTheme(theme)
  }, [])

  return <Router />
}
