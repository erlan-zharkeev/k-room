import { spawnSync } from 'node:child_process'

const isWindows = process.platform === 'win32'
const prettierCommand = isWindows ? 'prettier.cmd' : 'prettier'

const stagedFilesResult = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=d', '-z'], {
  encoding: 'buffer'
})

if (stagedFilesResult.error) {
  console.error(stagedFilesResult.error.message)
  process.exit(1)
}

if (stagedFilesResult.status !== 0) {
  if (stagedFilesResult.stderr.length > 0) {
    console.error(stagedFilesResult.stderr.toString('utf8').trim())
  }

  process.exit(stagedFilesResult.status ?? 1)
}

const stagedFiles = stagedFilesResult.stdout.toString('utf8').split('\0').filter(Boolean)

if (stagedFiles.length === 0) {
  process.exit(0)
}

const prettierResult = spawnSync(prettierCommand, ['--write', '--ignore-unknown', ...stagedFiles], {
  stdio: 'inherit',
  shell: isWindows
})

if (prettierResult.error) {
  console.error(prettierResult.error.message)
  process.exit(1)
}

process.exit(prettierResult.status ?? 0)
