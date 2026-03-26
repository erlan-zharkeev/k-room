import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { login } from 'features/auth/login/controller'
import { fieldsValidation } from 'features/auth/login/lib'

import { validateRequest } from 'shared-middleware'

export const loginRouter = Router()

loginRouter.post(AuthEndpointsEnum.Login, fieldsValidation, validateRequest, login)
