import fs from 'fs'
import path from 'path'

import { SERVER_ENV } from 'src/shared/config'

export const httpsOptions = SERVER_ENV.isDev
  ? {
      key: fs.readFileSync(path.resolve(process.cwd(), '../dev-certs', 'k-room-dev-key.pem')),
      cert: fs.readFileSync(path.resolve(process.cwd(), '../dev-certs', 'k-room-dev.pem'))
    }
  : {}
