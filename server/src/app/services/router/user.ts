import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { accessTokenValidator } from 'src/features/auth'
import {
  getUserDataController,
  markInfoAsReadController,
  RESET_PASSWORD_FIELDS_VALIDATION,
  resetPasswordController,
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  updateUserDataController
} from 'src/features/user'

import { multerUploader } from 'src/entities/media'

import { validateRequest } from 'src/shared/middleware'

export const userRouter = Router()
userRouter.get(UserEndpointsEnum.GetUserData, accessTokenValidator, getUserDataController)
userRouter.post(
  UserEndpointsEnum.ResetPassword,
  RESET_PASSWORD_FIELDS_VALIDATION,
  validateRequest,
  resetPasswordController
)
userRouter.post(
  UserEndpointsEnum.EditUserData,
  accessTokenValidator,
  multerUploader.single('file'),
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  validateRequest,
  updateUserDataController
)
userRouter.patch(UserEndpointsEnum.MarkInfoNotificationAsRead, accessTokenValidator, markInfoAsReadController)
