import dotenv, { DotenvParseOutput } from 'dotenv'
import { EnvVariables } from './types/EnvVariables'

const ENV = dotenv.config().parsed as DotenvParseOutput | EnvVariables

export default ENV
