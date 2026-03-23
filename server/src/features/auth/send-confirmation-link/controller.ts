import { ISendConfirmationLinkResponse, StatusEnum } from 'common-types'

import { AppResponseType, IAppRequest } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'

export const sendConfirmationLink = async (req: IAppRequest, res: AppResponseType<ISendConfirmationLinkResponse>) => {
  // const { email } = req.body
  try {
    // TODO Отправить ссылку на почту
    // const confirmEmailData = await sendEmailConfirmationLink(email)
    // return res.json(confirmEmailData)
  } catch {
    throwHTTPError(StatusEnum.Server, res, MESSAGE.failedSendEmailConfirmationLink)
  }
}
