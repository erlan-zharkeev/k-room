import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { login } from 'src/features/auth/login'
import { fieldsValidation } from 'src/features/auth/login'

import { validateRequest } from 'src/shared/middleware'

export const loginRouter = Router()

loginRouter.post(AuthEndpointsEnum.Login, fieldsValidation, validateRequest, login)
