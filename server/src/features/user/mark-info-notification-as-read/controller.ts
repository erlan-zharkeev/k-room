import { IMarkAsReadPayload, StatusEnum } from 'common'

import { MESSAGE } from 'features/user/mark-info-notification-as-read/config'

import { UserModel } from 'entities/user'

import { AppResponseType, IAppRequest, SHARED_MESSAGE } from 'shared-config'
import { getLocalizedText, throwHTTPError } from 'shared-lib'

export const markInfoAsRead = async (req: IAppRequest, res: AppResponseType<null>) => {
  const language = req.language

  try {
    const userId = req.app.locals.id
    const { id }: IMarkAsReadPayload = req.body

    await UserModel.updateOne({ _id: userId }, { $set: { [`personal.infoNotifications.${id}`]: 'read' } })

    res.json({ payload: null, message: { text: getLocalizedText(SHARED_MESSAGE.success, language), silent: true } })
  } catch {
    return throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.failed, language))
  }

  return {}
}
