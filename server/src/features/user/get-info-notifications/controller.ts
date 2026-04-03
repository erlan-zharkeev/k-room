import { IGetInfoNotificationsResponse, StatusEnum } from 'common'

import { getActiveInfoNotifications } from 'src/features/info-notification'

import { AppResponseType, IAppRequest, SHARED_I18N } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { GET_INFO_NOTIFICATIONS_I18N } from './config'

export const getInfoNotificationsController = async (
  req: IAppRequest,
  res: AppResponseType<IGetInfoNotificationsResponse>
) => {
  const { language } = req
  const basicError = getLocalizedText(GET_INFO_NOTIFICATIONS_I18N.failed, language)

  try {
    const notifications = await getActiveInfoNotifications()

    return res.json({
      payload: notifications,
      message: { text: getLocalizedText(SHARED_I18N.success, language), silent: true }
    })
  } catch (error) {
    return throwHTTPError(StatusEnum.Server, res, basicError, false, error)
  }
}
