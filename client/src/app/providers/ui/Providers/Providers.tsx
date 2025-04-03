import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { store, persistor } from 'src/app/store'
import { ReactNode, useRef } from 'react'
import { AdditionalServiceContext, RefsContext } from 'src/shared/providers'
import { initializeApp } from 'firebase/app'
import * as processLib from 'process'
import { useMakeCall } from 'src/entities/call'
import { useFirebase } from '../../hooks'

interface ProviderProps {
  children: ReactNode
}

const AdditionalServiceProvider: React.FC<ProviderProps> = ({ children }) => {
  const call = useRef(useMakeCall())
  const firebase = useRef(useFirebase())
  const services = { call, firebase }
  return <AdditionalServiceContext.Provider value={services}>{children}</AdditionalServiceContext.Provider>
}

const RefsProvider: React.FC<ProviderProps> = ({ children }) => {
  const interlocutorVideoDom = useRef<HTMLVideoElement>(null)
  const selfVideoDom = useRef<HTMLVideoElement>(null)
  const refs = { interlocutorVideoDom, selfVideoDom }
  return <RefsContext.Provider value={refs}>{children}</RefsContext.Provider>
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
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RefsProvider>
        <AdditionalServiceProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</BrowserRouter>
        </AdditionalServiceProvider>
      </RefsProvider>
    </PersistGate>
  </Provider>
)
