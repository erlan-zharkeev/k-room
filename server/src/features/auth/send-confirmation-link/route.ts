import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { sendConfirmationLinkController } from '.'

export const sendEmailConfirmationLinkRouter = Router()

sendEmailConfirmationLinkRouter.post(AuthEndpointsEnum.SendEmailConfirmationLink, sendConfirmationLinkController)
