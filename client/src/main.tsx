import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'src/store'
import 'src/firebase/firebase'
import App from 'src/App'
import { RefsProvider } from 'src/providers/RefsProvider'
import { AdditionalServiceProvider } from './providers/AdditionalServiceProvider'
import * as process from 'process'

window['process'] = process
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
