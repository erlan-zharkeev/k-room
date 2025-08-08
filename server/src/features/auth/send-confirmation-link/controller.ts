import { StatusEnum } from 'common-types'
import type { Request, Response } from 'express'
import { ServerNotificationMessage } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

export const sendConfirmationLink = async (req: Request, res: Response) => {
  // const { email } = req.body
  try {
    // const confirmEmailData = await sendEmailConfirmationLink(email)
    // return res.json(confirmEmailData)
  } catch {
    throwHTTPError(StatusEnum.Unreachable, res, ServerNotificationMessage.FailedSendConfirmEmail)
  }
}
