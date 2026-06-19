// Ensures the Tauri package version stays aligned with the client package version before desktop builds.
const fs = require('node:fs')
const path = require('node:path')

const SCRIPT_DIR = __dirname
const CLIENT_ROOT = path.resolve(SCRIPT_DIR, '..')
const PACKAGE_JSON_PATH = path.join(CLIENT_ROOT, 'package.json')
const TAURI_CONFIG_PATH = path.join(CLIENT_ROOT, 'src-tauri', 'tauri.conf.json')
const CARGO_TOML_PATH = path.join(CLIENT_ROOT, 'src-tauri', 'Cargo.toml')
const TAURI_PACKAGE_VERSION_PATH = '../package.json'

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'))

const readCargoPackageVersion = () => {
  const source = fs.readFileSync(CARGO_TOML_PATH, 'utf-8')
  const lines = source.split(/\r?\n/)
  let isPackageSection = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine === '[package]') {
      isPackageSection = true

      continue
    }

    if (isPackageSection && trimmedLine.startsWith('[')) break

    if (isPackageSection && trimmedLine.startsWith('version')) {
      const versionMatch = trimmedLine.match(/^version\s*=\s*"([^"]+)"$/)

      if (versionMatch) return versionMatch[1]
    }
  }

  throw new Error(`Cannot read package version from ${CARGO_TOML_PATH}`)
}

const packageData = readJson(PACKAGE_JSON_PATH)
const tauriConfig = readJson(TAURI_CONFIG_PATH)
const cargoPackageVersion = readCargoPackageVersion()
const hasTauriPackageVersionPath = tauriConfig.version === TAURI_PACKAGE_VERSION_PATH
const hasCargoPackageVersion = cargoPackageVersion === packageData.version

if (hasTauriPackageVersionPath && hasCargoPackageVersion) {
  process.exit(0)
}

if (!hasTauriPackageVersionPath) {
  console.error(`Expected Tauri version to point to ${TAURI_PACKAGE_VERSION_PATH}`)
}

if (!hasCargoPackageVersion) {
  console.error(`Expected Cargo package version ${cargoPackageVersion} to match client version ${packageData.version}`)
}

process.exit(1)
