import 'primeicons/primeicons.css'
import { createApp } from 'vue'

import App from './app/App.vue'
import { initApp } from './app/bootstrap/init-app'
import './app/styles/main.css'

const app = createApp(App)

initApp(app)
app.mount('#app')
