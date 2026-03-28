import { initSentry } from 'src/app/config'
import { runServer } from 'src/app/services'

initSentry()

runServer().catch((error) => {
  console.error('-Server startup failed')
  console.error(String(error))
})
