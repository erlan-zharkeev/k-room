import { AuthEndpointsEnum } from 'common-types'
import { Router } from 'express'
import { validateRequest } from 'shared-middleware'

import { login } from './controller'
import { fieldsValidation } from './lib'

export const loginRouter = Router()

loginRouter.post(AuthEndpointsEnum.Login, fieldsValidation, validateRequest, login)
