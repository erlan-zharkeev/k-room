import { USER_ENDPOINTS } from 'common'
import { Router } from 'express'

import { multerUploader } from 'src/media'

import { accessTokenValidatorMiddleware } from 'src/modules/auth'

import { validateRequestMiddleware } from 'src/shared/middleware/validate-request-middleware'

import { updateUserDataController } from './controller'
import { UPDATE_USER_DATA_FIELDS_VALIDATION } from './lib/fields-validation'

export const updateUserRouter = Router()

updateUserRouter.patch(
  USER_ENDPOINTS.editUserData,
  accessTokenValidatorMiddleware,
  multerUploader.single('file'),
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  validateRequestMiddleware,
  updateUserDataController
)
