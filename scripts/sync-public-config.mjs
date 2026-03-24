import fs from 'node:fs'
import path from 'node:path'

const rootPath = process.cwd()
const envPath = path.join(rootPath, '.env.production')
const readmeTemplatePath = path.join(rootPath, 'config/templates/README.template.md')
const readmePath = path.join(rootPath, 'README.md')
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

if (env.HOST == null || env.HOST === '') {
  throw new Error('HOST is missing in .env.production')
}

const domain = new URL(env.HOST).hostname

const applyTemplate = (templatePath, outputPath, replacements) => {
  let content = fs.readFileSync(templatePath, 'utf8')

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`{{${key}}}`, value)
  }

  fs.writeFileSync(outputPath, content)
}

applyTemplate(readmeTemplatePath, readmePath, { HOST: env.HOST })
applyTemplate(nginxTemplatePath, nginxPath, { DOMAIN: domain })
