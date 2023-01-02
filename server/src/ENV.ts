import dotenv, { DotenvParseOutput } from 'dotenv'
import { EnvVariables } from './../../types'

const ENV = dotenv.config({ path: `./_env/.env.${process.env.NODE_ENV}` }).parsed as DotenvParseOutput | EnvVariables
ENV.IS_DEV = process.env.NODE_ENV === 'development'

export default ENV
