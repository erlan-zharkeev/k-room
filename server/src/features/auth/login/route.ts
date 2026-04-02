import { Router } from 'express'

import { AUTH_ENDPOINTS } from 'common'

import { validateRequest } from 'src/shared/middleware'

import { loginController } from './controller'
import { LOGIN_FIELDS_VALIDATION } from './lib'

export const loginRouter = Router()

loginRouter.post(AUTH_ENDPOINTS.login, LOGIN_FIELDS_VALIDATION, validateRequest, loginController)
