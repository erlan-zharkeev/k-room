import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const PRODUCTION_BRANCH = 'production'
const CLIENT_PACKAGE_JSON_PATH = 'client/package.json'
const CLIENT_CARGO_TOML_PATH = 'client/src-tauri/Cargo.toml'
const VERSION_BUMP_SCRIPT_PATH = 'scripts/version/bump-client-version.mjs'
const VERSION_BUMP_FLAGS = ['--patch', '--minor', '--major']
const E2E_SCRIPT_NAME = 'e2e'
const PACKAGE_MANAGER_COMMAND = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

const versionBumpFlag = readVersionBumpFlag()

const read = (command, args, { trim = false } = {}) => {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe']
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    if (result.stderr) console.error(result.stderr.trim())
    process.exit(result.status ?? 1)
  }

  return trim ? result.stdout.trim() : result.stdout
}

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const assertCleanWorkingTree = (message) => {
  const status = read('git', ['status', '--porcelain'], { trim: true })

  if (status) {
    console.error(message)
    console.error('Commit, stash, or discard local changes before deploying.')
    process.exit(1)
  }
}

const currentBranch = read('git', ['branch', '--show-current'], { trim: true })

if (currentBranch !== PRODUCTION_BRANCH) {
  console.error(`Deploy is allowed only from the ${PRODUCTION_BRANCH} branch.`)
  console.error(`Current branch: ${currentBranch || '(detached)'}`)
  process.exit(1)
}

assertCleanWorkingTree('Deploy requires a clean working tree.')
run(PACKAGE_MANAGER_COMMAND, ['run', E2E_SCRIPT_NAME], {
  shell: process.platform === 'win32'
})
assertCleanWorkingTree('E2E tests changed the working tree.')
run('node', [VERSION_BUMP_SCRIPT_PATH, versionBumpFlag])
run('git', ['add', CLIENT_PACKAGE_JSON_PATH, CLIENT_CARGO_TOML_PATH])
run('git', ['commit', '-m', `deploy(production): v${readClientVersion()}`])
run('git', ['push', 'origin', PRODUCTION_BRANCH])

function readVersionBumpFlag() {
  const args = process.argv.slice(2)
  const bumpFlags = args.filter((arg) => VERSION_BUMP_FLAGS.includes(arg))
  const unknownArgs = args.filter((arg) => !VERSION_BUMP_FLAGS.includes(arg))

  if (unknownArgs.length > 0) {
    console.error(`Unknown deploy argument: ${unknownArgs.join(', ')}`)
    console.error(`Use one of ${VERSION_BUMP_FLAGS.join(', ')}.`)
    process.exit(1)
  }

  if (bumpFlags.length > 1) {
    console.error(`Use only one deploy version argument: ${VERSION_BUMP_FLAGS.join(', ')}.`)
    process.exit(1)
  }

  return bumpFlags[0] ?? '--patch'
}

function readClientVersion() {
  const packageData = JSON.parse(readFileSync(CLIENT_PACKAGE_JSON_PATH, 'utf-8'))

  return packageData.version
}
