import * as processLib from 'process'

import { ReactNode, useRef } from 'react'

import { initializeApp } from 'firebase/app'
import { ProviderType } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import 'src/shared/lib/db/db'
import { store } from 'src/app/store'

import { useMakeCall } from 'src/entities/call'

import { AdditionalServiceContext, RefsContext } from 'src/shared/providers'

const AdditionalServiceProvider = ({ children }: { children: ReactNode }) => {
  const call = useRef(useMakeCall())
  const services = { call }
  return <AdditionalServiceContext.ProviderType value={services}>{children}</AdditionalServiceContext.ProviderType>
}

const RefsProvider = ({ children }: { children: ReactNode }) => {
  const interlocutorVideoDom = useRef<HTMLVideoElement>(null)
  const selfVideoDom = useRef<HTMLVideoElement>(null)
  const refs = { interlocutorVideoDom, selfVideoDom }
  return <RefsContext.ProviderType value={refs}>{children}</RefsContext.ProviderType>
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'k-room-3a49a.firebaseapp.com',
  projectId: 'k-room-3a49a',
  storageBucket: 'k-room-3a49a.appspot.com',
  messagingSenderId: '199419640502',
  appId: '1:199419640502:web:71eb090633e8593d704417',
  measurementId: 'G-81GNPVFH7E'
}

initializeApp(firebaseConfig)

// @ts-expect-error
window.process = processLib.process as NodeJS.Process
export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ProviderType store={store}>
    <RefsProvider>
      <AdditionalServiceProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</BrowserRouter>
      </AdditionalServiceProvider>
    </RefsProvider>
  </ProviderType>
)
