import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { sendConfirmationLink } from './controller'

export const sendEmailConfirmationLinkRouter = Router()

sendEmailConfirmationLinkRouter.post(AuthEndpointsEnum.SendEmailConfirmationLink, sendConfirmationLink)
