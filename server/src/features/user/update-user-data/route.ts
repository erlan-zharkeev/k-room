import { Router } from 'express'

import { UserEndpointsEnum } from 'common-types'

import { accessTokenValidator } from 'features/auth'

import { multerUploader } from 'entities/media'

import { validateRequest } from 'shared-middleware'

import { updateUserData } from './controller'
import { fieldsValidation } from './lib'

export const updateUserRouter = Router()

updateUserRouter.post(
  UserEndpointsEnum.EditUserData,
  accessTokenValidator,
  multerUploader.single('file'),
  fieldsValidation,
  validateRequest,
  updateUserData
)
