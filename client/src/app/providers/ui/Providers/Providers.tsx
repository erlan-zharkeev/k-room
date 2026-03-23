import * as processLib from 'process'

import { useRef } from 'react'
import type { ReactNode } from 'react'

import { initializeApp } from 'firebase/app'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { FIREBASE_CONFIG } from 'src/app/providers/config'
import { store } from 'src/app/store'

import { useMakeCall } from 'src/entities/call'

import { AdditionalServiceContext, RefsContext } from 'src/shared/providers'

// Some browser-side dependencies still expect a global `process` shim at runtime.
window.process = processLib

const AdditionalServiceProvider = ({ children }: { children: ReactNode }) => {
  const call = useRef(useMakeCall())
  const services = { call }
  return <AdditionalServiceContext.Provider value={services}>{children}</AdditionalServiceContext.Provider>
}

const RefsProvider = ({ children }: { children: ReactNode }) => {
  const interlocutorVideoDom = useRef<HTMLVideoElement>(null)
  const selfVideoDom = useRef<HTMLVideoElement>(null)
  const refs = { interlocutorVideoDom, selfVideoDom }
  return <RefsContext.Provider value={refs}>{children}</RefsContext.Provider>
}

initializeApp(FIREBASE_CONFIG)

export const Providers = ({ children }: { children: ReactNode }) => (
  <ReduxProvider store={store}>
    <RefsProvider>
      <AdditionalServiceProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</BrowserRouter>
      </AdditionalServiceProvider>
    </RefsProvider>
  </ReduxProvider>
)
