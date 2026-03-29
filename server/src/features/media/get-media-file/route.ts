import { Router } from 'express'

import { MediaEndpointsEnum } from 'common'

import { accessTokenValidator } from 'src/features/auth'

import { getMediaFileController } from './index'

export const getMediaFileRouter = Router()

getMediaFileRouter.get(`${MediaEndpointsEnum.GetMediaFile}/:id`, accessTokenValidator, getMediaFileController)
