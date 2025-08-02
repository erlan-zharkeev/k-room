import 'src/shared/config/styles'
import { useEffect } from 'react'

import { useCheckAuth } from 'src/features/auth'
import { useNetworkMonitor } from 'src/features/monitor-network/hooks'
import { useViewportMonitor } from 'src/features/monitor-viewport'
import { useThemeUpdate } from 'src/features/settings/update-theme'

import { useSettings } from 'src/entities/settings'

import { useInitializeIndexedDb } from './hooks/'
import { Router } from './router'

export const App = () => {
  const { initializeIndexedDb } = useInitializeIndexedDb()
  const { theme } = useSettings()
  const { setThemeToDom } = useThemeUpdate()

  useNetworkMonitor()
  useViewportMonitor()
  useCheckAuth()

  const initializeApp = async () => {
    await initializeIndexedDb()
    setThemeToDom(theme)
  }

  useEffect(() => {
    initializeApp()
  }, [])

  return <Router />
}
