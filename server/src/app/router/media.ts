import { Router } from 'express'

import { MediaEndpointsEnum } from 'common'

import { accessTokenValidator } from 'src/features/auth'
import { getMediaFile } from 'src/features/media'

export const mediaRouter = Router()

mediaRouter.get(`${MediaEndpointsEnum.GetMediaFile}/:id`, accessTokenValidator, getMediaFile)
