import { AUTH_ENDPOINTS } from 'common'
import { Router } from 'express'

import { sendConfirmationLinkController } from './controller'

export const sendEmailConfirmationLinkRouter = Router()

sendEmailConfirmationLinkRouter.post(AUTH_ENDPOINTS.sendEmailConfirmationLink, sendConfirmationLinkController)
