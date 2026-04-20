import * as processLib from 'process'

import { useRef } from 'react'

import * as Sentry from '@sentry/react'
import { initializeApp } from 'firebase/app'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { AdditionalServiceContext, RefsContext } from 'src/shared/providers'
import { store } from 'src/shared/store'

import { FIREBASE_CONFIG } from '../../internals'
import { ErrorFallback } from '../../views/ErrorFallback'

import { IContextProviderProps } from './internals'

// import { useMakeCall } from 'src/entities/call'

// Some browser-side dependencies still expect a global `process` shim at runtime.
window.process = processLib

const AdditionalServiceProvider = ({ children }: IContextProviderProps) => {
  // const call = useRef(useMakeCall())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <AdditionalServiceContext.Provider value={{} as any}>{children}</AdditionalServiceContext.Provider>
}

const RefsProvider = ({ children }: IContextProviderProps) => {
  const interlocutorVideoDom = useRef<HTMLVideoElement>(null)
  const selfVideoDom = useRef<HTMLVideoElement>(null)
  const refs = { interlocutorVideoDom, selfVideoDom }
  return <RefsContext.Provider value={refs}>{children}</RefsContext.Provider>
}

initializeApp(FIREBASE_CONFIG)

export const Providers = ({ children }: IContextProviderProps) => (
  <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
    <ReduxProvider store={store}>
      <RefsProvider>
        <AdditionalServiceProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</BrowserRouter>
        </AdditionalServiceProvider>
      </RefsProvider>
    </ReduxProvider>
  </Sentry.ErrorBoundary>
)
