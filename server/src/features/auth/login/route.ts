import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { validateRequest } from 'src/shared/middleware'

import { loginController } from './controller'
import { LOGIN_FIELDS_VALIDATION } from './lib'

export const loginRouter = Router()

loginRouter.post(AuthEndpointsEnum.Login, LOGIN_FIELDS_VALIDATION, validateRequest, loginController)
