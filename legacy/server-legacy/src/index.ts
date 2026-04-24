import { log } from 'src/shared/lib/log'
import { serverCaptureSentryException } from 'src/shared/lib/sentry'

import { initSentry } from './app/sentry'
import { runServer } from './app/server'

initSentry()

runServer().catch((error) => {
  log.error('-Server startup failed')
  log.error(String(error))
  serverCaptureSentryException(error)
  process.exit(1)
})
