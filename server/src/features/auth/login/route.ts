import { Router } from 'express'
import { login, LOGIN_FIELDS_VALIDATION } from 'src/features/auth'
import { validateRequest } from 'src/shared/middleware'

import { AuthEndpointsEnum } from 'common'

export const loginRouter = Router()

loginRouter.post(AuthEndpointsEnum.Login, LOGIN_FIELDS_VALIDATION, validateRequest, login)
