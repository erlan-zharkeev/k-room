import { DEFAULT_APP_LANGUAGE, REQ_STATUS } from 'common'

import { InfoNotificationModel } from 'src/entities/info-notification'

import { AppError, localizedText } from 'src/shared/lib'

import { publishInfoNotificationToAllUsers } from './../shared'
import { INFO_NOTIFICATION_ADMIN_I18N } from './i18n'
import {
  IInfoNotificationAdminActionContextType,
  IInfoNotificationAdminActionRequest,
  IInfoNotificationAdminRecordActionResponseType
} from './types'

export const ADMIN_INFO_NOTIFICATION_OPTIONS = {
  resource: InfoNotificationModel,
  options: {
    id: 'info-notifications',
    navigation: 'Content',
    listProperties: ['_id', 'title.ru', 'title.en', 'isActive', 'createdAt'],
    showProperties: ['_id', 'title.ru', 'title.en', 'content.ru', 'content.en', 'isActive', 'createdAt', 'updatedAt'],
    editProperties: ['title.ru', 'title.en', 'content.ru', 'content.en', 'isActive'],
    filterProperties: ['_id', 'title.ru', 'title.en', 'isActive', 'createdAt'],
    actions: {
      publishToAllUsers: {
        actionType: 'record',
        icon: 'Send',
        guard: localizedText(INFO_NOTIFICATION_ADMIN_I18N.publishGuard, DEFAULT_APP_LANGUAGE),
        component: false,
        handler: async (
          _request: IInfoNotificationAdminActionRequest,
          _response: unknown,
          context: IInfoNotificationAdminActionContextType
        ): Promise<IInfoNotificationAdminRecordActionResponseType> => {
          const { record, currentAdmin, resource, h } = context

          if (!record) {
            throw new AppError(
              REQ_STATUS.notFound,
              localizedText(INFO_NOTIFICATION_ADMIN_I18N.recordNotFound, DEFAULT_APP_LANGUAGE)
            )
          }

          await publishInfoNotificationToAllUsers(record.id(), DEFAULT_APP_LANGUAGE)

          const updatedRecord = await InfoNotificationModel.findById(record.id()).lean()

          if (!updatedRecord) {
            throw new AppError(
              REQ_STATUS.notFound,
              localizedText(INFO_NOTIFICATION_ADMIN_I18N.publishedRecordNotFound, DEFAULT_APP_LANGUAGE)
            )
          }

          return {
            record: record.toJSON(currentAdmin),
            redirectUrl: h.recordActionUrl({
              resourceId: resource.id(),
              recordId: String(updatedRecord._id),
              actionName: 'show',
              search: 'refresh=true'
            }),
            notice: {
              message: localizedText(INFO_NOTIFICATION_ADMIN_I18N.published, DEFAULT_APP_LANGUAGE),
              type: 'success'
            }
          }
        }
      }
    },
    properties: {
      _id: {
        label: 'Id'
      }
    }
  }
}
