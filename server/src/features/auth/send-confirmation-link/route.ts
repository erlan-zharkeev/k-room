import { Router } from 'express'

import { AuthEndpointsEnum } from 'common-types'

import { sendConfirmationLink } from './controller'

export const sendEmailConfirmationLinkRouter = Router()

sendEmailConfirmationLinkRouter.get(AuthEndpointsEnum.SendEmailConfirmationLink, sendConfirmationLink)
