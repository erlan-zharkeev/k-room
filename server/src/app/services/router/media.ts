import { Router } from 'express'

import { MEDIA_ENDPOINTS } from 'common'

import { accessTokenValidator } from 'src/features/auth'
import { getMediaFileController } from 'src/features/media'

export const mediaRouter = Router()

mediaRouter.get(`${MEDIA_ENDPOINTS.getMediaFile}/:id`, accessTokenValidator, getMediaFileController)
