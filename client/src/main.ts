import 'primeicons/primeicons.css'
import { createApp } from 'vue'

import App from 'src/app/App.vue'
import { initApp } from 'src/app/bootstrap/init-app'
import 'src/app/styles/base.scss'
import 'src/app/styles/overwrite.scss'

const app = createApp(App)

initApp(app)
app.mount('#app')
