import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

import App from './app/App.vue'
import './app/styles/main.css'
import { APP_TITLE } from './shared/config'

const app = createApp(App)

document.title = APP_TITLE

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.mount('#app')
