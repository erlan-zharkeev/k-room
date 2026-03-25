import fs from 'node:fs'
import type { IEnvVariables } from 'common'
import path from 'node:path'

const NODE_ENV = process.env.NODE_ENV ?? 'development'
const envFilePath = path.resolve(process.cwd(), `.env.${NODE_ENV}`)
const envFileContent = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf-8') : ''

const parseEnvValue = (value: string) => value.trim().replace(/^['"]|['"]$/g, '')

const envMap = envFileContent
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#') && line.includes('='))
  .reduce<Record<string, string>>((acc, line) => {
    const separatorIndex = line.indexOf('=')
    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1)
    acc[key] = parseEnvValue(value)
    return acc
  }, {})

const getEnvValue = <TKey extends keyof IEnvVariables>(key: TKey) =>
  (process.env[key] as IEnvVariables[TKey] | undefined) ?? (envMap[key] as IEnvVariables[TKey])

export const E2E_ENV = {
  NODE_ENV,
  IS_DEV: NODE_ENV === 'development',
  PLAYWRIGHT_BASE_URL: getEnvValue('PLAYWRIGHT_BASE_URL'),
  PLAYWRIGHT_SERVER_URL: getEnvValue('PLAYWRIGHT_SERVER_URL'),
  PLAYWRIGHT_MONGO_HOST: getEnvValue('PLAYWRIGHT_MONGO_HOST'),
  PLAYWRIGHT_MONGO_PORT: Number(getEnvValue('PLAYWRIGHT_MONGO_PORT')),
  CI: Boolean(process.env.CI)
} as const

export const E2E_TIMEOUTS = {
  mongoConnection: 3_000,
  webServer: 120_000
} as const
