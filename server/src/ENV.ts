import dotenv, { DotenvParseOutput } from 'dotenv'
import { EnvVariables } from './types/EnvVariables'

const ENV = dotenv.config({ path: `.env.${process.env.NODE_ENV}` }).parsed as DotenvParseOutput | EnvVariables

export default ENV
