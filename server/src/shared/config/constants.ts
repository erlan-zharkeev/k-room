import type { IEnvVariables } from 'common-types'
import dotenv, { type DotenvParseOutput } from 'dotenv'
import type { ISystemDataConstants } from 'shared-config'

const envs = dotenv.config({ path: `../.env.${process.env.NODE_ENV}` }).parsed as DotenvParseOutput | IEnvVariables
envs.IS_DEV = process.env.NODE_ENV === 'development'
envs.SERVER_ASSETS_PATH = envs.IS_DEV ? './src/assets/' : './build/assets/'
envs.SERVER_URL = envs.IS_DEV ? `${envs.HOST}:${envs.SERVER_PORT}/api` : `${envs.HOST}/api`
envs.CLIENT_URL = envs.IS_DEV ? `${envs.HOST}:${envs.CLIENT_PORT}` : `${envs.HOST}`
const {
  K_ROOM_ACCESS_TOKEN_SECRET,
  EMAIL_CONFIRM_SECRET,
  K_ROOM_MAIL_PASS,
  K_ROOM_REFRESH_TOKEN_SECRET,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  RESEND_FROM_NAME
} = process.env

export const ENV = {
  ...envs,
  K_ROOM_ACCESS_TOKEN_SECRET,
  EMAIL_CONFIRM_SECRET,
  K_ROOM_MAIL_PASS,
  K_ROOM_REFRESH_TOKEN_SECRET,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  RESEND_FROM_NAME
} as IEnvVariables

const host = new URL(ENV.HOST)

export const ORIGINS = [`https://${host.hostname}`, `http://${host.hostname}`]

export const SYSTEM_DATA: ISystemDataConstants = {
  sharp: {
    avatar: {
      dimensions: {
        x: 300,
        y: 300
      },
      quality: 100
    },
    'common-compressed': {
      quality: 60,
      dimensions: {
        x: null,
        y: null
      }
    },
    'common-uncompressed': {
      quality: 100,
      dimensions: {
        x: null,
        y: null
      }
    }
  },
  maxMbQuantityTransfer: 10
}
