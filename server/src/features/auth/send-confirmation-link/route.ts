import { Router } from 'express'

import { AUTH_ENDPOINTS } from 'common'

import { sendConfirmationLinkController } from './index'

export const sendEmailConfirmationLinkRouter = Router()

sendEmailConfirmationLinkRouter.post(AUTH_ENDPOINTS.sendEmailConfirmationLink, sendConfirmationLinkController)
