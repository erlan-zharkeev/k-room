import { IMarkAsReadPayload, StatusEnum } from 'common'

import { MARK_INFO_NOTIFICATION_AS_READ_I18N } from './config'

import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest, SHARED_I18N } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

export const markInfoAsReadController = async (req: IAppRequest, res: AppResponseType<null>) => {
  const language = req.language

  try {
    const userId = req.app.locals.id
    const { id }: IMarkAsReadPayload = req.body

    await UserModel.updateOne({ _id: userId }, { $set: { [`personal.infoNotifications.${id}`]: 'read' } })

    res.json({ payload: null, message: { text: getLocalizedText(SHARED_I18N.success, language), silent: true } })
  } catch {
    return throwHTTPError(StatusEnum.Server, res, getLocalizedText(MARK_INFO_NOTIFICATION_AS_READ_I18N.failed, language))
  }

  return {}
}
