import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { accessTokenValidator } from 'src/features/auth'

import { multerUploader } from 'src/entities/media'

import { validateRequest } from 'src/shared/middleware'

import { UPDATE_USER_DATA_FIELDS_VALIDATION, updateUserDataController } from './index'

export const updateUserRouter = Router()

updateUserRouter.post(
  UserEndpointsEnum.EditUserData,
  accessTokenValidator,
  multerUploader.single('file'),
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  validateRequest,
  updateUserDataController
)
