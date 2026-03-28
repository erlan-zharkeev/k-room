import { initSentry } from 'src/app/config'
import { runServer } from 'src/app/services'

import { log } from 'src/shared/lib'

initSentry()

runServer().catch((error) => {
  log.error('-Server startup failed')
  log.error(String(error))
})
