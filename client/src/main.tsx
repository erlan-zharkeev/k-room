import ReactDOM from 'react-dom/client'
import { initializeApp } from 'firebase/app'
import * as processLib from 'process'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { App } from './App'
import { store } from './store'
import { RefsProvider, AdditionalServiceProvider } from './providers'
import appData from './../package.json'
import { $clg } from './services'

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
const root = document.getElementById('root') as HTMLElement

const persistor = persistStore(store)

$clg('success', `${appData.name} v.${appData.version}`)
ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RefsProvider>
        <AdditionalServiceProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AdditionalServiceProvider>
      </RefsProvider>
    </PersistGate>
  </Provider>
)
