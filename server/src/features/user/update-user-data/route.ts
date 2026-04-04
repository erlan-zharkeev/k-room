import { Router } from 'express'

import { USER_ENDPOINTS } from 'common'

import { accessTokenValidatorMiddleware } from 'src/features/auth'

import { multerUploader } from 'src/entities/media'

import { validateRequestMiddleware } from 'src/shared/middleware'

import { UPDATE_USER_DATA_FIELDS_VALIDATION, updateUserDataController } from './index'

export const updateUserRouter = Router()

updateUserRouter.patch(
  USER_ENDPOINTS.editUserData,
  accessTokenValidatorMiddleware,
  multerUploader.single('file'),
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  validateRequestMiddleware,
  updateUserDataController
)
