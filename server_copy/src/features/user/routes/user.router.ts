import { Router } from 'express'
import { UserEndpointsEnum } from 'common-types'
import { UserController } from 'server/src/controllers'
import { accessTokenValidator, fileUploader } from 'server/src/middlewares'

export const userRouter = Router()

userRouter.get(UserEndpointsEnum.GetUserData, accessTokenValidator, UserController.getUserData)

userRouter.post(
  UserEndpointsEnum.UpdateUserData,
  accessTokenValidator,
  fileUploader.single('file'),
  UserController.updateUserData
)

userRouter.post(UserEndpointsEnum.ResetPassword, UserController.resetPassword)
