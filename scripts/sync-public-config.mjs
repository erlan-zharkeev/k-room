import fs from 'node:fs'
import path from 'node:path'

const rootPath = process.cwd()
const stage = process.argv[2] ?? 'production'
const sharedEnvPath = path.join(rootPath, '.env.shared')
const envPath = path.join(rootPath, `.env.${stage}`)
const nginxTemplatePath = path.join(rootPath, 'nginx/webserver.template.conf')
const nginxPath = path.join(rootPath, 'nginx/webserver.conf')

const addTrailingSlash = (value) => (value.endsWith('/') ? value : `${value}/`)

const parseEnv = (fileContent) =>
  Object.fromEntries(
    fileContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '' && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const [rawKey, ...rawValueParts] = line.split('=')
        const rawValue = rawValueParts.join('=').trim()
        const value = rawValue.replace(/^['"]|['"]$/g, '')

        return [rawKey.trim(), value]
      })
  )

if (!fs.existsSync(sharedEnvPath)) {
  throw new Error('.env.shared is missing')
}

const env = {
  ...parseEnv(fs.readFileSync(sharedEnvPath, 'utf8')),
  ...parseEnv(fs.readFileSync(envPath, 'utf8'))
}

if (env.APP_HOST == null || env.APP_HOST === '') {
  throw new Error(`APP_HOST is missing in .env.${stage}`)
}

if (env.API_HOST == null || env.API_HOST === '') {
  throw new Error(`API_HOST is missing in .env.${stage}`)
}

if (env.MONGO_ADMIN_HOST == null || env.MONGO_ADMIN_HOST === '') {
  throw new Error(`MONGO_ADMIN_HOST is missing in .env.${stage}`)
}

if (env.API_PATH == null || env.API_PATH === '') {
  throw new Error('API_PATH is missing in .env.shared')
}

if (env.SOCKET_PATH == null || env.SOCKET_PATH === '') {
  throw new Error('SOCKET_PATH is missing in .env.shared')
}

if (env.ADMIN_ROOT_PATH == null || env.ADMIN_ROOT_PATH === '') {
  throw new Error('ADMIN_ROOT_PATH is missing in .env.shared')
}

const appDomain = new URL(env.APP_HOST).hostname
const apiDomain = new URL(env.API_HOST).hostname
const mongoAdminDomain = new URL(env.MONGO_ADMIN_HOST).hostname

const applyTemplate = (templatePath, outputPath, replacements) => {
  let content = fs.readFileSync(templatePath, 'utf8')

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`{{${key}}}`, value)
  }

  fs.writeFileSync(outputPath, content)
}

applyTemplate(nginxTemplatePath, nginxPath, {
  APP_DOMAIN: appDomain,
  API_DOMAIN: apiDomain,
  MONGO_ADMIN_DOMAIN: mongoAdminDomain,
  API_PATH: addTrailingSlash(env.API_PATH),
  ADMIN_ROOT_PATH: env.ADMIN_ROOT_PATH,
  SOCKET_PATH: addTrailingSlash(env.SOCKET_PATH)
})
