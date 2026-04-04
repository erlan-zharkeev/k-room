import { Router } from 'express'

import { USER_ENDPOINTS } from 'common'

import { accessTokenValidatorMiddleware } from 'src/features/auth'
import {getUserDataController, RESET_PASSWORD_FIELDS_VALIDATION, resetPasswordController,UPDATE_USER_DATA_FIELDS_VALIDATION,
  updateUserDataController } from 'src/features/user'

import { multerUploader } from 'src/entities/media'

import { validateRequestMiddleware } from 'src/shared/middleware'

export const userRouter = Router()
userRouter.get(USER_ENDPOINTS.getUserData, accessTokenValidatorMiddleware, getUserDataController)
userRouter.post(
  USER_ENDPOINTS.resetPassword,
  RESET_PASSWORD_FIELDS_VALIDATION,
  validateRequestMiddleware,
  resetPasswordController
)
userRouter.patch(
  USER_ENDPOINTS.editUserData,
  accessTokenValidatorMiddleware,
  multerUploader.single('file'),
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  validateRequestMiddleware,
  updateUserDataController
)
