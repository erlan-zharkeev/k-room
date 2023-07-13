import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'src/store'
import 'src/firebase/firebase'
import { createContext } from 'react'
import $firebase from './services/$firebase'
import $call from './services/$call'
import App from 'src/App'
import { RefsProvider } from 'src/components/Common/RefsProvider/RefsProvider'

const root = document.getElementById('root') as HTMLElement

const persistor = persistStore(store)
const services = { $firebase, $call }
export const ServiceContext = createContext(services)

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ServiceContext.Provider value={services}>
        <RefsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RefsProvider>
      </ServiceContext.Provider>
    </PersistGate>
  </Provider>
)
