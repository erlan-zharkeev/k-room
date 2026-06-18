import { spawnSync } from 'node:child_process'

const PRODUCTION_BRANCH = 'production'
const DEPLOY_COMMIT_MESSAGE = 'deploy(production): trigger'

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

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit'
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const currentBranch = read('git', ['branch', '--show-current'], { trim: true })

if (currentBranch !== PRODUCTION_BRANCH) {
  console.error(`Deploy is allowed only from the ${PRODUCTION_BRANCH} branch.`)
  console.error(`Current branch: ${currentBranch || '(detached)'}`)
  process.exit(1)
}

const status = read('git', ['status', '--porcelain'], { trim: true })

if (status) {
  console.error('Deploy requires a clean working tree.')
  console.error('Commit, stash, or discard local changes before deploying.')
  process.exit(1)
}

run('git', ['commit', '--allow-empty', '-m', DEPLOY_COMMIT_MESSAGE])
run('git', ['push', 'origin', PRODUCTION_BRANCH])
