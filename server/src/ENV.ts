import dotenv, { DotenvParseOutput } from 'dotenv'
import { EnvVariables } from './@types'

const envs = dotenv.config({ path: `./.env.${process.env.NODE_ENV}` }).parsed as DotenvParseOutput | EnvVariables

envs.IS_DEV = process.env.NODE_ENV === 'development'
envs.SERVER_ASSETS_PATH = envs.IS_DEV ? './src/assets/' : './build/assets/'
envs.SERVER_URL = envs.IS_DEV ? `${envs.HOST}:${envs.SERVER_PORT}/api` : `${envs.HOST}/api`
envs.CLIENT_URL = envs.IS_DEV ? `${envs.HOST}:${envs.CLIENT_PORT}/api` : `${envs.HOST}`
const { K_ROOM_ACCESS_TOKEN_SECRET, K_ROOM_MAIL_PASS, K_ROOM_REFRESH_TOKEN_SECRET } = process.env

export const ENV = {
  ...envs,
  K_ROOM_ACCESS_TOKEN_SECRET,
  K_ROOM_MAIL_PASS,
  K_ROOM_REFRESH_TOKEN_SECRET
} as EnvVariables
