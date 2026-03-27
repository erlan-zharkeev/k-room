import ReactDOM from 'react-dom/client'

import { App } from 'src/app/App'
import { Providers } from 'src/app/providers'
import { initSentry } from 'src/app/providers/config'

const root = document.getElementById('root') as HTMLElement

initSentry()

ReactDOM.createRoot(root).render(
  <Providers>
    <App />
  </Providers>
)
