import ReactDOM from 'react-dom/client'
import { Providers, App } from './app'

const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(
  <Providers>
    <App />
  </Providers>
)
