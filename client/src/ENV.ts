import { EnvVariables } from 'common-types'

declare const SERVER_PORT: string
declare const HOST: string
declare const IS_DEV: boolean
declare const MAX_RECONNECT_ATTEMPTS: number

export default {
  SERVER_PORT,
  HOST,
  IS_DEV,
  MAX_RECONNECT_ATTEMPTS
} as EnvVariables
