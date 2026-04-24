import { AUTH_ENDPOINTS } from 'common'
import { Router } from 'express'

import { validateRequestMiddleware } from 'src/shared/middleware/validate-request-middleware'

import { loginController } from './controller'
import { LOGIN_FIELDS_VALIDATION } from './lib/fields-validation'

export const loginRouter = Router()

loginRouter.post(AUTH_ENDPOINTS.login, LOGIN_FIELDS_VALIDATION, validateRequestMiddleware, loginController)
