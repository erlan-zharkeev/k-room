import { AuthEndpointsEnum } from 'common-types'
import { Router } from 'express'
import { validateRequest } from 'shared-middleware'

import { login } from './controller'
import { fieldsValidation } from './lib/fields-validation'

export const loginRouter = Router()

loginRouter.get(AuthEndpointsEnum.Login, fieldsValidation, validateRequest, login)
