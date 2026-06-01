import type { EnvKey, EnvSource, ReadEnvOptions, SecretEnvFileReader } from '../types'

export const parseEnvContent = (content: string): Record<string, string> =>
  Object.fromEntries(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== '' && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const [rawKey, ...rawValueParts] = line.split('=')
        const rawValue = rawValueParts.join('=').trim()
        const value = rawValue.replace(/^['"]|['"]$/g, '')

        return [rawKey.trim(), value]
      })
  )

export const readSecretEnv = (secretEnvPath: string, fileReader: SecretEnvFileReader): Record<string, string> => {
  if (!fileReader.existsSync(secretEnvPath)) return {}

  return parseEnvContent(fileReader.readFileSync(secretEnvPath, 'utf-8'))
}

export const readEnv = (key: EnvKey, source: EnvSource, options: ReadEnvOptions = {}) =>
  [options.runtimeEnv?.[key], source[key], options.secretEnv?.[key]].find((value) => value != null && value !== '') ??
  ''
