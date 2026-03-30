import fs from 'node:fs'
import path from 'node:path'

const rootPath = process.cwd()
const stage = process.argv[2] ?? 'production'
const envPath = path.join(rootPath, `.env.${stage}`)
const nginxTemplatePath = path.join(rootPath, 'config/nginx/webserver.template.conf')
const nginxPath = path.join(rootPath, 'config/nginx/webserver.conf')

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

const env = parseEnv(fs.readFileSync(envPath, 'utf8'))

if (env.APP_HOST == null || env.APP_HOST === '') {
  throw new Error(`APP_HOST is missing in .env.${stage}`)
}

if (env.API_HOST == null || env.API_HOST === '') {
  throw new Error(`API_HOST is missing in .env.${stage}`)
}

const appDomain = new URL(env.APP_HOST).hostname
const apiDomain = new URL(env.API_HOST).hostname

const applyTemplate = (templatePath, outputPath, replacements) => {
  let content = fs.readFileSync(templatePath, 'utf8')

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`{{${key}}}`, value)
  }

  fs.writeFileSync(outputPath, content)
}

applyTemplate(nginxTemplatePath, nginxPath, {
  APP_DOMAIN: appDomain,
  API_DOMAIN: apiDomain
})
