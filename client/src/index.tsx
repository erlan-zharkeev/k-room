import 'src/firebase/firebase.ts'
import { createRoot } from 'react-dom/client'
import App from 'src/App'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'src/store'
import * as process from 'process'

window.global = window
window.process = process

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

const persistor = persistStore(store)

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
