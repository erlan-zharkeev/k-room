import { Router } from 'express'

import { AuthEndpointsEnum } from 'common-types'

import { sendConfirmationLink } from './controller'

export const sendEmailConfirmationLinkRouter = Router()

sendEmailConfirmationLinkRouter.post(AuthEndpointsEnum.SendEmailConfirmationLink, sendConfirmationLink)
