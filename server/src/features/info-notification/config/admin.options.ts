import { ActionContext, ActionRequest, RecordActionResponse } from 'adminjs'

import { DEFAULT_APP_LANGUAGE, StatusEnum } from 'common'

import { InfoNotificationModel } from 'src/entities/info-notification'

import { SERVER_ENV } from 'src/shared/config'
import { AppError, localizedText } from 'src/shared/lib'

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
        guard: localizedText(INFO_NOTIFICATION_ADMIN_I18N.publishGuard, DEFAULT_APP_LANGUAGE),
        component: false,
        handler: async (
          _request: ActionRequest,
          _response: unknown,
          context: ActionContext
        ): Promise<RecordActionResponse> => {
          const { record, currentAdmin } = context

          if (!record) {
            throw new AppError(
              StatusEnum.NotFound,
              localizedText(INFO_NOTIFICATION_ADMIN_I18N.recordNotFound, DEFAULT_APP_LANGUAGE)
            )
          }

          await publishInfoNotificationToAllUsers(record.id(), DEFAULT_APP_LANGUAGE)

          const updatedRecord = await InfoNotificationModel.findById(record.id()).lean()

          if (!updatedRecord) {
            throw new AppError(
              StatusEnum.NotFound,
              localizedText(INFO_NOTIFICATION_ADMIN_I18N.publishedRecordNotFound, DEFAULT_APP_LANGUAGE)
            )
          }

          return {
            record: record.toJSON(currentAdmin),
            redirectUrl: `${SERVER_ENV.adminRootPath}/resources/info-notifications/records/${String(updatedRecord._id)}/show?refresh=true`,
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
