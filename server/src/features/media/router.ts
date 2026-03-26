import { Router } from 'express'

import { getMediaFileRouter } from 'features/media/get-media-file'

export const mediaRouter = Router()

mediaRouter.use(getMediaFileRouter)
