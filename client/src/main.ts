import 'primeicons/primeicons.css'
import type { LocalizedTextType } from 'global-shared'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

import App from './app/App.vue'
import { router } from './app/router'
import './app/styles/main.css'
import { primeVueTheme } from './app/theme'
import { CLIENT_ENV, CLIENT_LANGUAGE } from './shared/config'

const app = createApp(App)

document.title = CLIENT_ENV.appName
app.config.globalProperties.$t = <T>(value: LocalizedTextType<T>) => value[CLIENT_LANGUAGE]

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: primeVueTheme,
    options: {
      darkModeSelector: '[theme="dark"]'
    }
  }
})

app.use(router)

app.mount('#app')
