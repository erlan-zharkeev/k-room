import { IMarkAsReadPayload, StatusEnum } from 'common'

import { I18N_MARK_INFO_NOTIFICATION_AS_READ_MESSAGE } from './config'

import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest, SHARED_MESSAGE } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

export const markInfoAsReadController = async (req: IAppRequest, res: AppResponseType<null>) => {
  const language = req.language

  try {
    const userId = req.app.locals.id
    const { id }: IMarkAsReadPayload = req.body

    await UserModel.updateOne({ _id: userId }, { $set: { [`personal.infoNotifications.${id}`]: 'read' } })

    res.json({ payload: null, message: { text: getLocalizedText(SHARED_MESSAGE.success, language), silent: true } })
  } catch {
    return throwHTTPError(StatusEnum.Server, res, getLocalizedText(I18N_MARK_INFO_NOTIFICATION_AS_READ_MESSAGE.failed, language))
  }

  return {}
}
