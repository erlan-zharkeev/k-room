import { IMarkAsReadPayload, StatusEnum } from 'common'

import { updateInfoNotificationStateStatus } from 'src/entities/info-notification-state'

import { AppResponseType, IAppRequest, SHARED_I18N } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { MARK_INFO_NOTIFICATION_AS_READ_I18N } from './config'

export const markInfoAsReadController = async (req: IAppRequest, res: AppResponseType<null>) => {
  const { language } = req
  const basicError = getLocalizedText(MARK_INFO_NOTIFICATION_AS_READ_I18N.failed, language)

  try {
    const userId = req.app.locals.id
    const { id }: IMarkAsReadPayload = req.body

    await updateInfoNotificationStateStatus({ userId, notificationId: id, status: 'read' })

    res.json({ payload: null, message: { text: getLocalizedText(SHARED_I18N.success, language), silent: true } })
  } catch (error) {
    return throwHTTPError(StatusEnum.Server, res, basicError, false, error)
  }

  return {}
}
