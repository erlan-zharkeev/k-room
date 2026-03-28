import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { accessTokenValidator } from 'src/features/auth'
import { updateUserData } from 'src/features/user/update-user-data'
import { fieldsValidation } from 'src/features/user/update-user-data'

import { multerUploader } from 'src/entities/media'

import { validateRequest } from 'src/shared/middleware'

export const updateUserRouter = Router()

updateUserRouter.post(
  UserEndpointsEnum.EditUserData,
  accessTokenValidator,
  multerUploader.single('file'),
  fieldsValidation,
  validateRequest,
  updateUserData
)
