import { MEDIA_ENDPOINTS } from 'common'
import { Router } from 'express'

import { accessTokenValidatorMiddleware } from 'src/modules/auth'

import { getMediaFileController } from './controller'

export const getMediaFileRouter = Router()

getMediaFileRouter.get(`${MEDIA_ENDPOINTS.getMediaFile}/:id`, accessTokenValidatorMiddleware, getMediaFileController)
