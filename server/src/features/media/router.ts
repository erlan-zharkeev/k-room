import { Router } from 'express'

import { getMediaFileRouter } from './get-media-file'

export const mediaRouter = Router()

mediaRouter.use(getMediaFileRouter)
