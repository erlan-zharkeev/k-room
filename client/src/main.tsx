import ReactDOM from 'react-dom/client'

import { App } from 'src/app/App'
import { initSentry, Providers } from 'src/app/providers'

const root = document.getElementById('root') as HTMLElement

initSentry()

ReactDOM.createRoot(root).render(
  <Providers>
    <App />
  </Providers>
)
