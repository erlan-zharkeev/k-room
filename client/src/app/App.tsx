import 'src/shared/config/styles/index.scss'
import { useEffect } from 'react'

import { useInitializeIndexedDb } from 'src/app/hooks'
import { Router } from 'src/app/router'

import { UnsupportedResolutionStub } from 'src/widgets/unsupported-resolution-stub'

import { useSyncAvatars } from 'src/features/avatars'
import { useNetworkMonitor } from 'src/features/monitor-network'
import { useViewportMonitor } from 'src/features/monitor-viewport'
import { useThemeUpdate } from 'src/features/settings'
import { useFetchUserData } from 'src/features/user'

import { useSettings } from 'src/shared/settings'

export const App = () => {
  const { initializeIndexedDb } = useInitializeIndexedDb()
  const { theme, language } = useSettings()
  const { setThemeToDom } = useThemeUpdate()
  const { fetchUserData } = useFetchUserData()

  useNetworkMonitor()
  useViewportMonitor()
  useSyncAvatars()

  const initializeApp = async () => {
    await initializeIndexedDb()
    await fetchUserData()
    setThemeToDom(theme)
  }

  useEffect(() => {
    initializeApp()
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <>
      <Router />
      <UnsupportedResolutionStub />
    </>
  )
}
