import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { sendConfirmationLink } from 'features/auth/send-confirmation-link/controller'

export const sendEmailConfirmationLinkRouter = Router()

sendEmailConfirmationLinkRouter.post(AuthEndpointsEnum.SendEmailConfirmationLink, sendConfirmationLink)
