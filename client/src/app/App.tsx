import 'src/shared/config/styles'
import { useEffect } from 'react'

import { UnsupportedResolutionStub } from 'src/widgets/unsupported-resolution-stub'

import { useHideMainLoader } from 'src/features/hide-main-loader'
import { useNetworkMonitor } from 'src/features/monitor-network/hooks'
import { useViewportMonitor } from 'src/features/monitor-viewport'
import { useThemeUpdate } from 'src/features/settings/update-theme'
import { useFetchUserData } from 'src/features/user'

import { useSettings } from 'src/entities/settings'

import { useInitializeIndexedDb } from './hooks/'
import { Router } from './router'

export const App = () => {
  const { initializeIndexedDb } = useInitializeIndexedDb()
  const { theme } = useSettings()
  const { setThemeToDom } = useThemeUpdate()
  const { fetchUserData } = useFetchUserData()
  const { hideMainLoader } = useHideMainLoader()

  useNetworkMonitor()
  useViewportMonitor()

  const initializeApp = async () => {
    await fetchUserData()
    await initializeIndexedDb()
    hideMainLoader()
    setThemeToDom(theme)
  }

  useEffect(() => {
    initializeApp()
  }, [])

  return (
    <>
      <Router />
      <UnsupportedResolutionStub />
    </>
  )
}
