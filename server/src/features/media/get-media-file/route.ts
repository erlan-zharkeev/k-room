import { Router } from 'express'

import { MediaEndpointsEnum } from 'common'

import { accessTokenValidator } from 'features/auth'
import { getMediaFile } from 'features/media'

export const getMediaFileRouter = Router()

getMediaFileRouter.get(`${MediaEndpointsEnum.GetMediaFile}/:id`, accessTokenValidator, getMediaFile)
