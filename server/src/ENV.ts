import dotenv, { DotenvParseOutput } from 'dotenv'
import { EnvVariables } from './../../types'

const ENV = dotenv.config({ path: `./_env/.env.${process.env.NODE_ENV}` }).parsed as DotenvParseOutput | EnvVariables
ENV.IS_DEV = process.env.NODE_ENV === 'development'
ENV.SERVER_ASSETS_PATH = ENV.IS_DEV ? './src/assets/' : './assets/'
ENV.SERVER_URL = ENV.IS_DEV ? `${ENV.HOST}:${ENV.SERVER_PORT}/api` : `${ENV.HOST}/api`

export default ENV
