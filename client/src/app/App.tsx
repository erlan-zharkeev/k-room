import 'src/shared/config/styles/index.scss'
import { useEffect } from 'react'

import { Router } from 'src/app/router'
import { useInitializeIndexedDb } from 'src/app/startup'

import { UnsupportedResolutionStub } from 'src/widgets/unsupported-resolution-stub'

import { useFetchUserData } from 'src/features/fetch-user-data'
import { useNetworkMonitor } from 'src/features/monitor-network'
import { useViewportMonitor } from 'src/features/monitor-viewport'
import { useSyncAvatars } from 'src/features/sync-avatars'
import { useThemeUpdate } from 'src/features/update-theme'

import { useSettings } from 'src/shared/preferences'

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
