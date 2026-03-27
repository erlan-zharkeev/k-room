import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { accessTokenValidator } from 'features/auth'
import { updateUserData } from 'features/user/update-user-data'
import { fieldsValidation } from 'features/user/update-user-data'

import { multerUploader } from 'entities/media'

import { validateRequest } from 'shared-middleware'

export const updateUserRouter = Router()

updateUserRouter.post(
  UserEndpointsEnum.EditUserData,
  accessTokenValidator,
  multerUploader.single('file'),
  fieldsValidation,
  validateRequest,
  updateUserData
)
