import dotenv, { DotenvParseOutput } from 'dotenv'
import { EnvVariables } from './../../types'

const ENV = dotenv.config({ path: `./.env.${process.env.NODE_ENV}` }).parsed as DotenvParseOutput | EnvVariables
ENV.IS_DEV = process.env.NODE_ENV === 'development'
ENV.SERVER_ASSETS_PATH = ENV.IS_DEV ? './src/assets/' : './build/assets/'
ENV.SERVER_URL = ENV.IS_DEV ? `${ENV.HOST}:${ENV.SERVER_PORT}/api` : `${ENV.HOST}/api`
ENV.CLIENT_URL = ENV.IS_DEV ? `${ENV.HOST}:${ENV.CLIENT_PORT}/api` : `${ENV.HOST}`
const { K_ROOM_ACCESS_TOKEN_SECRET, K_ROOM_MAIL_PASS, K_ROOM_REFRESH_TOKEN_SECRET } = process.env

export default {
  ...ENV,
  K_ROOM_ACCESS_TOKEN_SECRET,
  K_ROOM_MAIL_PASS,
  K_ROOM_REFRESH_TOKEN_SECRET
} as EnvVariables
