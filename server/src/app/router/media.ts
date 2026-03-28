import { Router } from 'express'

import { accessTokenValidator } from 'src/features/auth'
import { getMediaFile } from 'src/features/media'

import { MediaEndpointsEnum } from 'common'

export const mediaRouter = Router()

mediaRouter.get(`${MediaEndpointsEnum.GetMediaFile}/:id`, accessTokenValidator, getMediaFile)
