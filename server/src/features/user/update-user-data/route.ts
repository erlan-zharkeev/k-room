import { UserEndpointsEnum } from 'common-types'
import { uploadAvatar } from 'entities/media'
import { Router } from 'express'
import { accessTokenValidator } from 'features/auth'
import { validateRequest } from 'shared-middleware'

import { updateUserData } from './controller'
import { fieldsValidation } from './lib'

export const updateUserRouter = Router()

updateUserRouter.post(
  UserEndpointsEnum.UpdateUserData,
  accessTokenValidator,
  fieldsValidation,
  validateRequest,
  uploadAvatar,
  updateUserData
)
