import { MediaEndpointsEnum } from 'common-types'
import { Router } from 'express'
import { accessTokenValidator } from 'features/auth'

import { getMediaFile } from './controller'

export const getMediaFileRouter = Router()

getMediaFileRouter.get(MediaEndpointsEnum.GetMediaFile, accessTokenValidator, getMediaFile)
