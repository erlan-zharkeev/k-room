import { IMarkAsReadPayload, StatusEnum } from 'common-types'

import { UserModel } from 'entities/user'

import { AppResponseType, IAppRequest } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'

export const markInfoAsRead = async (req: IAppRequest, res: AppResponseType<null>) => {
  try {
    const userId = req.app.locals.id
    const { id }: IMarkAsReadPayload = req.body

    await UserModel.updateOne({ _id: userId }, { $set: { [`personal.infoNotifications.${id}`]: 'read' } })

    res.json({ data: null, message: { text: 'success', silent: true } })
  } catch {
    return throwHTTPError(StatusEnum.Server, res, MESSAGE.failed)
  }

  return {}
}
