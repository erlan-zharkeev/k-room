import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

import App from './app/App.vue'
import './app/styles/main.css'
import { primeVueTheme } from './app/theme'
import { APP_TITLE } from './shared/config'

const app = createApp(App)

document.title = APP_TITLE

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: primeVueTheme,
    options: {
      darkModeSelector: '[theme="dark"]'
    }
  }
})

app.mount('#app')
