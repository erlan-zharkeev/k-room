import { Router } from 'express'

import { MediaEndpointsEnum } from 'common'

import { accessTokenValidator } from 'features/auth'

import { getMediaFile } from './controller'

export const getMediaFileRouter = Router()

getMediaFileRouter.get(`${MediaEndpointsEnum.GetMediaFile}/:id`, accessTokenValidator, getMediaFile)
