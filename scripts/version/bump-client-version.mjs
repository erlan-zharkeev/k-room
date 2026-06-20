import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const CLIENT_PACKAGE_JSON_PATH = join(rootDir, 'client/package.json')
const CLIENT_CARGO_TOML_PATH = join(rootDir, 'client/src-tauri/Cargo.toml')
const VERSION_BUMP_KINDS = ['patch', 'minor', 'major']
const VERSION_BUMP_FLAGS = VERSION_BUMP_KINDS.map((kind) => `--${kind}`)
const DRY_RUN_FLAG = '--dry-run'

const { bumpKind, isDryRun } = readOptions()
const packageData = readJson(CLIENT_PACKAGE_JSON_PATH)
const currentVersion = readVersion(packageData.version, 'client/package.json')
const currentCargoVersion = readCargoPackageVersion()

if (currentCargoVersion !== currentVersion) {
  console.error(
    `Cannot bump client version because Cargo version ${currentCargoVersion} does not match ${currentVersion}.`
  )
  process.exit(1)
}

const nextVersion = bumpVersion(currentVersion, bumpKind)
const nextPackageContent = `${JSON.stringify({ ...packageData, version: nextVersion }, null, 2)}\n`
const nextCargoContent = updateCargoPackageVersion(nextVersion)

if (!isDryRun) {
  writeFileSync(CLIENT_PACKAGE_JSON_PATH, nextPackageContent)
  writeFileSync(CLIENT_CARGO_TOML_PATH, nextCargoContent)
}

console.log(`Client version: ${currentVersion} -> ${nextVersion}`)

function readOptions() {
  const args = process.argv.slice(2)
  const bumpFlags = args.filter((arg) => VERSION_BUMP_FLAGS.includes(arg))
  const unknownArgs = args.filter((arg) => !VERSION_BUMP_FLAGS.includes(arg) && arg !== DRY_RUN_FLAG)

  if (unknownArgs.length > 0) {
    console.error(`Unknown version bump argument: ${unknownArgs.join(', ')}`)
    console.error(`Use one of ${VERSION_BUMP_FLAGS.join(', ')}, plus optional ${DRY_RUN_FLAG}.`)
    process.exit(1)
  }

  if (bumpFlags.length > 1) {
    console.error(`Use only one version bump argument: ${VERSION_BUMP_FLAGS.join(', ')}.`)
    process.exit(1)
  }

  return {
    bumpKind: bumpFlags[0]?.slice(2) ?? 'patch',
    isDryRun: args.includes(DRY_RUN_FLAG)
  }
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

function readVersion(value, fileName) {
  if (typeof value === 'string' && /^\d+\.\d+\.\d+$/.test(value)) return value

  console.error(`Expected ${fileName} version to use x.y.z format.`)
  process.exit(1)
}

function bumpVersion(version, bumpKind) {
  const [major, minor, patch] = version.split('.').map(Number)

  if (bumpKind === 'major') return `${major + 1}.0.0`
  if (bumpKind === 'minor') return `${major}.${minor + 1}.0`

  return `${major}.${minor}.${patch + 1}`
}

function readCargoPackageVersion() {
  const source = readFileSync(CLIENT_CARGO_TOML_PATH, 'utf-8')
  const versionMatch = findCargoPackageVersion(source)

  if (versionMatch) return readVersion(versionMatch[2], 'client/src-tauri/Cargo.toml')

  console.error('Cannot read package version from client/src-tauri/Cargo.toml.')
  process.exit(1)
}

function updateCargoPackageVersion(nextVersion) {
  const source = readFileSync(CLIENT_CARGO_TOML_PATH, 'utf-8')
  const versionMatch = findCargoPackageVersion(source)

  if (!versionMatch) {
    console.error('Cannot update package version in client/src-tauri/Cargo.toml.')
    process.exit(1)
  }

  const [, prefix, , suffix] = versionMatch

  return `${source.slice(0, versionMatch.index)}${prefix}${nextVersion}${suffix}${source.slice(versionMatch.endIndex)}`
}

function findCargoPackageVersion(source) {
  const packageSectionMatch = source.match(/^\[package\]\s*$/m)

  if (!packageSectionMatch) return null

  const packageSectionStartIndex = packageSectionMatch.index + packageSectionMatch[0].length
  const packageSectionSource = source.slice(packageSectionStartIndex)
  const nextSectionMatch = packageSectionSource.match(/^\[.+\]\s*$/m)
  const packageSectionEndIndex = nextSectionMatch ? packageSectionStartIndex + nextSectionMatch.index : source.length
  const packageSection = source.slice(packageSectionStartIndex, packageSectionEndIndex)
  const versionMatch = packageSection.match(/(^\s*version\s*=\s*")(\d+\.\d+\.\d+)(".*$)/m)

  if (!versionMatch) return null

  versionMatch.index = packageSectionStartIndex + versionMatch.index
  versionMatch.endIndex = versionMatch.index + versionMatch[0].length

  return versionMatch
}
