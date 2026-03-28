import fs from 'fs'
import path from 'path'
import { ENV } from 'src/shared/config'

export const httpsOptions = ENV.IS_DEV
  ? {
      key: fs.readFileSync(path.join(__dirname, '../config/dev-certs', 'k-room-dev-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '../config/dev-certs', 'k-room-dev.pem'))
    }
  : {}
