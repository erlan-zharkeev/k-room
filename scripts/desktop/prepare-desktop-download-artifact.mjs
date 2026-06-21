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
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DESKTOP_PLATFORMS = {
  windows: {
    label: 'PC',
    installerFileName: 'K-Room-Setup.exe',
    installerDownloadPath: '/downloads/K-Room-Setup.exe',
    updaterTargets: ['windows-x86_64']
  },
  macos: {
    label: 'Mac',
    installerFileName: 'K-Room.dmg',
    installerDownloadPath: '/downloads/K-Room.dmg',
    updaterFileName: 'K-Room.app.tar.gz',
    updaterDownloadPath: '/downloads/desktop/K-Room.app.tar.gz',
    updaterTargets: ['darwin-x86_64', 'darwin-aarch64']
  }
}

const platformId = process.argv[2]

if (!Object.hasOwn(DESKTOP_PLATFORMS, platformId)) {
  console.error(
    `Usage: node scripts/desktop/prepare-desktop-download-artifact.mjs ${Object.keys(DESKTOP_PLATFORMS).join('|')}`
  )
  process.exit(1)
}

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const targetDir = join(rootDir, 'client/src-tauri/target')
const outputDir = join(rootDir, '.desktop-downloads', platformId)
const downloadsDir = join(outputDir, 'downloads')
const desktopDownloadsDir = join(downloadsDir, 'desktop')
const metadataDir = join(outputDir, 'metadata')
const platformConfig = DESKTOP_PLATFORMS[platformId]

rmSync(outputDir, { recursive: true, force: true })
mkdirSync(downloadsDir, { recursive: true })
mkdirSync(desktopDownloadsDir, { recursive: true })
mkdirSync(metadataDir, { recursive: true })

const targetFiles = listFiles(targetDir)
const metadata =
  platformId === 'windows' ? prepareWindowsDownloadArtifact(targetFiles) : prepareMacosDownloadArtifact(targetFiles)

writeFileSync(join(metadataDir, `${platformId}.json`), `${JSON.stringify(metadata, null, 2)}\n`)

function prepareWindowsDownloadArtifact(targetFiles) {
  const installerPath = findRequiredFile(
    targetFiles,
    (filePath) => {
      const normalizedPath = normalizePath(filePath)

      return normalizedPath.includes('/bundle/nsis/') && normalizedPath.endsWith('.exe')
    },
    'Windows NSIS installer'
  )
  const signaturePath = findRequiredSignature(installerPath, targetFiles)
  const signature = readSignature(signaturePath)

  copyFileSync(installerPath, join(downloadsDir, platformConfig.installerFileName))

  return {
    platformId,
    label: platformConfig.label,
    installerFileName: platformConfig.installerFileName,
    installerDownloadPath: platformConfig.installerDownloadPath,
    sourceInstallerFileName: basename(installerPath),
    updaterTargets: platformConfig.updaterTargets.map((platformKey) => ({
      platformKey,
      fileName: platformConfig.installerFileName,
      downloadPath: platformConfig.installerDownloadPath,
      signature
    }))
  }
}

function prepareMacosDownloadArtifact(targetFiles) {
  const installerPath = findRequiredFile(
    targetFiles,
    (filePath) => {
      const normalizedPath = normalizePath(filePath)

      return normalizedPath.includes('/bundle/dmg/') && normalizedPath.endsWith('.dmg')
    },
    'macOS DMG installer'
  )
  const updaterBundlePath = findRequiredFile(
    targetFiles,
    (filePath) => {
      const normalizedPath = normalizePath(filePath)

      return normalizedPath.includes('/bundle/macos/') && normalizedPath.endsWith('.app.tar.gz')
    },
    'macOS updater bundle'
  )
  const signaturePath = findRequiredSignature(updaterBundlePath, targetFiles)
  const signature = readSignature(signaturePath)

  copyFileSync(installerPath, join(downloadsDir, platformConfig.installerFileName))
  copyFileSync(updaterBundlePath, join(desktopDownloadsDir, platformConfig.updaterFileName))

  return {
    platformId,
    label: platformConfig.label,
    installerFileName: platformConfig.installerFileName,
    installerDownloadPath: platformConfig.installerDownloadPath,
    sourceInstallerFileName: basename(installerPath),
    updaterTargets: platformConfig.updaterTargets.map((platformKey) => ({
      platformKey,
      fileName: platformConfig.updaterFileName,
      downloadPath: platformConfig.updaterDownloadPath,
      signature
    }))
  }
}

function findRequiredSignature(bundlePath, targetFiles) {
  const directSignaturePath = `${bundlePath}.sig`

  if (existsSync(directSignaturePath)) return directSignaturePath

  return findRequiredFile(
    targetFiles,
    (filePath) => basename(filePath) === `${basename(bundlePath)}.sig`,
    `${basename(bundlePath)} signature`
  )
}

function findRequiredFile(files, predicate, description) {
  const matchingFiles = files.filter(predicate)

  if (matchingFiles.length > 0) return matchingFiles[0]

  console.error(`Could not find ${description} in ${targetDir}.`)
  process.exit(1)
}

function readSignature(filePath) {
  const signature = readFileSync(filePath, 'utf-8').trim()

  if (signature) return signature

  console.error(`Signature file is empty: ${filePath}.`)
  process.exit(1)
}

function listFiles(dirPath) {
  if (!existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}.`)
    process.exit(1)
  }

  return readdirSync(dirPath).flatMap((entryName) => {
    const entryPath = join(dirPath, entryName)
    const entryStats = statSync(entryPath)

    return entryStats.isDirectory() ? listFiles(entryPath) : [entryPath]
  })
}

function normalizePath(filePath) {
  return filePath.replaceAll('\\', '/').toLowerCase()
}
