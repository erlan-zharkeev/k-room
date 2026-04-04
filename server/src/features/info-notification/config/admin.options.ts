import { ActionContext, ActionRequest, RecordActionResponse } from 'adminjs'

import { DEFAULT_APP_LANGUAGE } from 'common'

import { InfoNotificationModel } from 'src/entities/info-notification'

import { publishInfoNotificationToAllUsers } from './../shared'

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
      publish: {
        actionType: 'record',
        icon: 'Send',
        guard: 'Publish this info notification to all users?',
        component: false,
        handler: async (
          _request: ActionRequest,
          _response: unknown,
          context: ActionContext
        ): Promise<RecordActionResponse> => {
          const { record, resource, currentAdmin, h } = context

          if (!record) {
            throw new Error('Info notification record was not found')
          }

          await publishInfoNotificationToAllUsers(record.id(), DEFAULT_APP_LANGUAGE)

          const updatedRecord = await resource.findOne(record.id(), context)

          if (!updatedRecord) {
            throw new Error('Published info notification record was not found after update')
          }

          return {
            record: updatedRecord.toJSON(currentAdmin),
            redirectUrl: h.recordActionUrl({
              resourceId: resource.id(),
              recordId: updatedRecord.id(),
              actionName: 'show'
            }),
            notice: {
              message: 'Info notification published',
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
