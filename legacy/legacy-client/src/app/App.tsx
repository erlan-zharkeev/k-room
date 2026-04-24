import 'src/shared/config/styles/index.scss'
import process from 'process'

import { useEffect } from 'react'
import { useRef } from 'react'

import { ErrorBoundary } from '@sentry/react'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { useInitIndexedDb } from 'src/app/bootstrap/use-init-indexed-db'
import { useNetworkMonitor } from 'src/app/bootstrap/use-network-monitor'
import { useRestoreUserSession } from 'src/app/bootstrap/use-restore-user-session'
import { Router } from 'src/app/router/Router'
import { useViewportMonitor } from 'src/features/monitor-viewport'
import { useSyncAvatars } from 'src/features/sync-avatars'
import { useThemeUpdate } from 'src/features/update-theme'
import { useSettings } from 'src/shared/preferences'
import { AdditionalServiceContext, RefsContext } from 'src/shared/providers'
import { store } from 'src/shared/store'
import { UnsupportedResolutionStub } from 'src/widgets/unsupported-resolution-stub'

import { ErrorFallback } from '../pages/error'

import { useInitFirebase } from './bootstrap/use-init-firebase'
import { useInitSentry } from './bootstrap/use-init-sentry'
import { IContextProviderProps } from './types'

useInitSentry()
useInitFirebase()

// Some browser-side dependencies still expect a global `process` shim at runtime.
window.process = process

const AdditionalServiceProvider = ({ children }: IContextProviderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <AdditionalServiceContext.Provider value={{} as any}>{children}</AdditionalServiceContext.Provider>
}

const RefsProvider = ({ children }: IContextProviderProps) => {
  const interlocutorVideoDom = useRef<HTMLVideoElement>(null)
  const selfVideoDom = useRef<HTMLVideoElement>(null)
  const refs = { interlocutorVideoDom, selfVideoDom }
  return <RefsContext.Provider value={refs}>{children}</RefsContext.Provider>
}

export const App = () => {
  const { initializeIndexedDb } = useInitIndexedDb()
  const { theme, language } = useSettings()
  const { setThemeToDom } = useThemeUpdate()
  const { fetchUserData } = useRestoreUserSession()

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
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ReduxProvider store={store}>
        <RefsProvider>
          <AdditionalServiceProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Router />
              <UnsupportedResolutionStub />
            </BrowserRouter>
          </AdditionalServiceProvider>
        </RefsProvider>
      </ReduxProvider>
    </ErrorBoundary>
  )
}
