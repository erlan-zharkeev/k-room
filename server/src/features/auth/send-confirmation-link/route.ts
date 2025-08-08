import { AuthEndpointsEnum } from 'common-types'
import { Router } from 'express'

import { sendConfirmationLink } from './controller'

export const sendEmailConfirmationLinkRouter = Router()

sendEmailConfirmationLinkRouter.get(AuthEndpointsEnum.SendEmailConfirmationLink, sendConfirmationLink)
