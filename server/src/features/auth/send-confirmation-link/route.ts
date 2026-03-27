import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { sendConfirmationLink } from 'features/auth/send-confirmation-link'

export const sendEmailConfirmationLinkRouter = Router()

sendEmailConfirmationLinkRouter.post(AuthEndpointsEnum.SendEmailConfirmationLink, sendConfirmationLink)
