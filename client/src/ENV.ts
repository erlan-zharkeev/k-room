import { EnvVariables } from 'common-types'

declare const SERVER_PORT: string
declare const HOST: string
declare const IS_DEV: boolean

export default {
  SERVER_PORT,
  HOST,
  IS_DEV
} as EnvVariables
