import { ActionContext, ActionRequest, RecordActionResponse } from 'adminjs'

import { DEFAULT_APP_LANGUAGE, StatusEnum } from 'common'

import { InfoNotificationModel } from 'src/entities/info-notification'

import { SERVER_ENV } from 'src/shared/config'
import { AppError, getLocalizedText } from 'src/shared/lib'

import { publishInfoNotificationToAllUsers } from './../shared'
import { INFO_NOTIFICATION_ADMIN_I18N } from './i18n'

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
        guard: getLocalizedText(INFO_NOTIFICATION_ADMIN_I18N.publishGuard),
        component: false,
        handler: async (
          _request: ActionRequest,
          _response: unknown,
          context: ActionContext
        ): Promise<RecordActionResponse> => {
          const { record, currentAdmin } = context

          if (!record) {
            throw new AppError(StatusEnum.NotFound, getLocalizedText(INFO_NOTIFICATION_ADMIN_I18N.recordNotFound))
          }

          await publishInfoNotificationToAllUsers(record.id(), DEFAULT_APP_LANGUAGE)

          const updatedRecord = await InfoNotificationModel.findById(record.id()).lean()

          if (!updatedRecord) {
            throw new AppError(
              StatusEnum.NotFound,
              getLocalizedText(INFO_NOTIFICATION_ADMIN_I18N.publishedRecordNotFound)
            )
          }

          return {
            record: record.toJSON(currentAdmin),
            redirectUrl: `${SERVER_ENV.adminRootPath}/resources/info-notifications/records/${String(updatedRecord._id)}/show?refresh=true`,
            notice: {
              message: getLocalizedText(INFO_NOTIFICATION_ADMIN_I18N.published),
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
