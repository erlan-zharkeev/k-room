import { StatusEnum } from 'common-types'
import type { Request, Response } from 'express'
import { throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'

export const sendConfirmationLink = async (req: Request, res: Response) => {
  // const { email } = req.body
  try {
    // TODO Отправить ссылку на почту
    // const confirmEmailData = await sendEmailConfirmationLink(email)
    // return res.json(confirmEmailData)
  } catch {
    throwHTTPError(StatusEnum.Server, res, MESSAGE.failedSendEmailConfirmationLink)
  }
}
