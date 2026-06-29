import { createApp } from 'vue'

import App from 'src/app/App.vue'
import 'src/app/styles/index.scss'

import { initApp } from './init-app'

const app = createApp(App)

initApp(app).then(() => {
  app.mount('#app')
})
