import { Router } from 'express'

import { MEDIA_ENDPOINTS } from 'common'

import { accessTokenValidatorMiddleware } from 'src/features/auth'

import { getMediaFileController } from './index'

export const getMediaFileRouter = Router()

getMediaFileRouter.get(`${MEDIA_ENDPOINTS.getMediaFile}/:id`, accessTokenValidatorMiddleware, getMediaFileController)
