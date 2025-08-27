import { corsOptions, httpsOptions } from 'app/config'
import bodyParser from 'body-parser'
import { RouteNamesEnum } from 'common-types'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { initMediaBuckets } from 'entities/media'
import express from 'express'
import { loadFixtures } from 'features/fixtures'
import https from 'https'
import methodOverride from 'method-override'
import { ENV } from 'shared-config'
import { initDataBase, log, setIO } from 'shared-lib'

import { rootRouter } from './router'
import { initIO } from './socket'

const app = express()

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(RouteNamesEnum.Api, rootRouter)

const server = https.createServer(httpsOptions, app)

const run = async () => {
  await initDataBase()
  initMediaBuckets()
  loadFixtures()
  const io = initIO(server)
  setIO(io)
  server.listen(ENV.SERVER_PORT, () => {
    log.success(`-Server listening on port ${ENV.SERVER_PORT}`)
  })
}

run()
