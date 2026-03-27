import { initSentry } from 'app/config'

initSentry()

// Entrypoint
import 'app/services/server'

export * from './config'
