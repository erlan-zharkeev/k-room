import { Router } from 'express'

import { getMediaFileRouter } from 'src/features/media/get-media-file'

export const mediaRouter = Router()

mediaRouter.use(getMediaFileRouter)
