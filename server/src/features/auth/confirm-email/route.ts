import { AuthEndpointsEnum } from 'common-types'
import { Router } from 'express'

import { refreshTokenValidator } from '../~shared'
import { confirmEmail } from './controller'

export const confirmEmailRouter = Router()

confirmEmailRouter.get(AuthEndpointsEnum.SendEmailConfirmation, refreshTokenValidator, confirmEmail)
