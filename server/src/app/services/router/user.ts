import { Router } from 'express'

import { USER_ENDPOINTS } from 'common'

import { accessTokenValidator } from 'src/features/auth'
import {getUserDataController, RESET_PASSWORD_FIELDS_VALIDATION, resetPasswordController,UPDATE_USER_DATA_FIELDS_VALIDATION,
  updateUserDataController } from 'src/features/user'

import { multerUploader } from 'src/entities/media'

import { validateRequest } from 'src/shared/middleware'

export const userRouter = Router()
userRouter.get(USER_ENDPOINTS.getUserData, accessTokenValidator, getUserDataController)
userRouter.post(
  USER_ENDPOINTS.resetPassword,
  RESET_PASSWORD_FIELDS_VALIDATION,
  validateRequest,
  resetPasswordController
)
userRouter.patch(
  USER_ENDPOINTS.editUserData,
  accessTokenValidator,
  multerUploader.single('file'),
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  validateRequest,
  updateUserDataController
)
