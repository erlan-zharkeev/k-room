import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DOWNLOAD_PLATFORM_ORDER = ['windows', 'macos']
const DOWNLOAD_SOURCE_DIR_NAME = 'downloads'
const METADATA_SOURCE_DIR_NAME = 'metadata'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const sourceDir = resolve(process.env.DESKTOP_DOWNLOADS_SOURCE_DIR || join(rootDir, '.desktop-downloads'))
const sourceDownloadsDir = join(sourceDir, DOWNLOAD_SOURCE_DIR_NAME)
const sourceMetadataDir = join(sourceDir, METADATA_SOURCE_DIR_NAME)
const outputDownloadsDir = resolve(process.env.DESKTOP_DOWNLOADS_OUTPUT_DIR || join(rootDir, 'client/public/downloads'))
const envData = readEnvFile(join(rootDir, '.env.production'))
const appHost = normalizeAppHost(process.env.APP_HOST || envData.APP_HOST)
const appVersion = readClientVersion()
const releasedAt = new Date().toISOString()
const metadataItems = readMetadataItems()

if (!appHost) {
  console.error('APP_HOST is required to generate desktop updater URLs.')
  process.exit(1)
}

if (!existsSync(sourceDownloadsDir)) {
  console.error(`Desktop downloads artifact directory not found: ${sourceDownloadsDir}.`)
  process.exit(1)
}

rmSync(outputDownloadsDir, { recursive: true, force: true })
copyDirectory(sourceDownloadsDir, outputDownloadsDir)
mkdirSync(join(outputDownloadsDir, 'desktop'), { recursive: true })

writeFileSync(
  join(outputDownloadsDir, 'releases.json'),
  `${JSON.stringify(createDownloadReleasesManifest(), null, 2)}\n`
)
writeFileSync(join(outputDownloadsDir, 'desktop/latest.json'), `${JSON.stringify(createUpdaterManifest(), null, 2)}\n`)
validateOutputDownloads()

function createDownloadReleasesManifest() {
  const platforms = Object.fromEntries(
    DOWNLOAD_PLATFORM_ORDER.map((platformId) => {
      const metadata = getMetadataItem(platformId)

      return [
        platformId,
        {
          label: metadata.label,
          fileName: metadata.installerFileName,
          downloadUrl: metadata.installerDownloadPath
        }
      ]
    })
  )

  return {
    releasedAt: releasedAt.slice(0, 10),
    platforms
  }
}

function createUpdaterManifest() {
  const platforms = Object.fromEntries(
    metadataItems.flatMap((metadata) =>
      metadata.updaterTargets.map((target) => [
        target.platformKey,
        {
          signature: target.signature,
          url: `${appHost}${target.downloadPath}`
        }
      ])
    )
  )

  return {
    version: appVersion,
    notes: '',
    pub_date: releasedAt,
    platforms
  }
}

function getMetadataItem(platformId) {
  const metadata = metadataItems.find((item) => item.platformId === platformId)

  if (metadata) return metadata

  console.error(`Missing desktop downloads metadata for ${platformId}.`)
  process.exit(1)
}

function validateOutputDownloads() {
  const requiredDownloadPaths = new Set([
    '/downloads/releases.json',
    '/downloads/desktop/latest.json',
    ...metadataItems.flatMap((metadata) => [
      metadata.installerDownloadPath,
      ...metadata.updaterTargets.map((target) => target.downloadPath)
    ])
  ])

  for (const downloadPath of requiredDownloadPaths) {
    validateOutputDownloadPath(downloadPath)
  }
}

function validateOutputDownloadPath(downloadPath) {
  const outputPath = resolveOutputDownloadPath(downloadPath)

  if (!existsSync(outputPath)) {
    console.error(`Desktop download file is missing: ${outputPath}.`)
    process.exit(1)
  }

  if (statSync(outputPath).size > 0) return

  console.error(`Desktop download file is empty: ${outputPath}.`)
  process.exit(1)
}

function resolveOutputDownloadPath(downloadPath) {
  const downloadsPrefix = '/downloads/'

  if (downloadPath.startsWith(downloadsPrefix))
    return join(outputDownloadsDir, downloadPath.slice(downloadsPrefix.length))

  console.error(`Desktop download path must start with ${downloadsPrefix}: ${downloadPath}.`)
  process.exit(1)
}

function readMetadataItems() {
  if (!existsSync(sourceMetadataDir)) {
    console.error(`Desktop downloads metadata directory not found: ${sourceMetadataDir}.`)
    process.exit(1)
  }

  const metadataItems = readdirSync(sourceMetadataDir)
    .filter((entryName) => entryName.endsWith('.json'))
    .map((entryName) => JSON.parse(readFileSync(join(sourceMetadataDir, entryName), 'utf-8')))

  for (const platformId of DOWNLOAD_PLATFORM_ORDER) {
    const hasMetadata = metadataItems.some((metadata) => metadata.platformId === platformId)

    if (!hasMetadata) {
      console.error(`Missing desktop downloads metadata for ${platformId}.`)
      process.exit(1)
    }
  }

  return metadataItems
}

function copyDirectory(sourcePath, outputPath) {
  mkdirSync(outputPath, { recursive: true })

  for (const entryName of readdirSync(sourcePath)) {
    const sourceEntryPath = join(sourcePath, entryName)
    const outputEntryPath = join(outputPath, entryName)
    const sourceEntryStats = statSync(sourceEntryPath)

    if (sourceEntryStats.isDirectory()) {
      copyDirectory(sourceEntryPath, outputEntryPath)
    } else {
      copyFileSync(sourceEntryPath, outputEntryPath)
    }
  }
}

function readClientVersion() {
  const packageData = JSON.parse(readFileSync(join(rootDir, 'client/package.json'), 'utf-8'))

  if (typeof packageData.version === 'string' && packageData.version) return packageData.version

  console.error('Cannot read client package version.')
  process.exit(1)
}

function readEnvFile(filePath) {
  if (!existsSync(filePath)) return {}

  return Object.fromEntries(
    readFileSync(filePath, 'utf-8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separatorIndex = line.indexOf('=')
        const key = line.slice(0, separatorIndex)
        const value = unquoteValue(line.slice(separatorIndex + 1))

        return [key, value]
      })
  )
}

function unquoteValue(value) {
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1)
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1)

  return value
}

function normalizeAppHost(value) {
  if (!value) return ''

  return value.replace(/\/+$/, '')
}
