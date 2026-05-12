export type EnvSourceType = Record<string, string | undefined>

export interface IReadEnvOptions {
  runtimeEnv?: EnvSourceType
  secretEnv?: EnvSourceType
}

export interface ISecretEnvFileReader {
  existsSync(path: string): boolean
  readFileSync(path: string, encoding: 'utf-8'): string
}

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

export const readSecretEnv = (secretEnvPath: string, fileReader: ISecretEnvFileReader): Record<string, string> => {
  if (!fileReader.existsSync(secretEnvPath)) return {}

  return parseEnvContent(fileReader.readFileSync(secretEnvPath, 'utf-8'))
}

export const readEnv = (key: string, source: EnvSourceType, options: IReadEnvOptions = {}) =>
  [options.runtimeEnv?.[key], source[key], options.secretEnv?.[key]].find((value) => value != null && value !== '') ??
  ''
