import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'src/store'
import App from 'src/App'
import { RefsProvider } from 'src/providers/RefsProvider'
import { AdditionalServiceProvider } from './providers/AdditionalServiceProvider'
import { initializeApp } from 'firebase/app'
import * as process from 'process'

console.log(import.meta.env, 'env', process.env)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? process.env.VITE_FIREBASE_API_KEY,
  authDomain: 'k-room-3a49a.firebaseapp.com',
  projectId: 'k-room-3a49a',
  storageBucket: 'k-room-3a49a.appspot.com',
  messagingSenderId: '199419640502',
  appId: '1:199419640502:web:71eb090633e8593d704417',
  measurementId: 'G-81GNPVFH7E'
}

initializeApp(firebaseConfig)

window.process = process
const root = document.getElementById('root') as HTMLElement

const persistor = persistStore(store)

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
