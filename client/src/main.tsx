import ReactDOM from 'react-dom/client'

import { Providers, App } from './app'
import { initSentry } from './app/providers/config'

const root = document.getElementById('root') as HTMLElement

initSentry()

ReactDOM.createRoot(root).render(
  <Providers>
    <App />
  </Providers>
)
