import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { accessTokenValidator } from 'src/features/auth'
import {
  getUserData,
  markInfoAsRead,
  RESET_PASSWORD_FIELDS_VALIDATION,
  resetPassword,
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  updateUserData
} from 'src/features/user'

import { multerUploader } from 'src/entities/media'

import { validateRequest } from 'src/shared/middleware'

export const userRouter = Router()

userRouter.get(UserEndpointsEnum.GetUserData, accessTokenValidator, getUserData)
userRouter.post(UserEndpointsEnum.ResetPassword, RESET_PASSWORD_FIELDS_VALIDATION, validateRequest, resetPassword)
userRouter.post(
  UserEndpointsEnum.EditUserData,
  accessTokenValidator,
  multerUploader.single('file'),
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  validateRequest,
  updateUserData
)
userRouter.patch(UserEndpointsEnum.MarkInfoNotificationAsRead, accessTokenValidator, markInfoAsRead)
