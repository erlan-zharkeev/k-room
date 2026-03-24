import fs from 'node:fs'
import path from 'node:path'

const rootPath = process.cwd()
const sourcePath = path.join(rootPath, 'src/shared/assets')
const targetPath = path.join(rootPath, 'build/assets')

fs.rmSync(targetPath, { recursive: true, force: true })

if (fs.existsSync(sourcePath)) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  fs.cpSync(sourcePath, targetPath, { recursive: true })
}
