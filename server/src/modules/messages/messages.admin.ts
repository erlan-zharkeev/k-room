import { formatHumanDateTime, isNumber, isString, type UnknownObject } from 'global-shared'

import { MessageModel } from './messages.model'

const ADMIN_MESSAGE_CREATED_AT_PATH = 'createdAt'
const ADMIN_MESSAGE_EDITED_AT_PATH = 'editedAt'

interface AdminMessageRecord {
  params?: UnknownObject
}

interface AdminMessageActionResponse {
  record?: AdminMessageRecord
  records?: AdminMessageRecord[]
}

const formatMessageDateParam = (params: AdminMessageRecord['params'], path: string) => {
  if (!params) {
    return
  }

  const value = params[path]
  if (!isNumber(value) && !isString(value)) {
    return
  }

  params[path] = formatHumanDateTime(value)
}

const withFormattedMessageDates = (response: AdminMessageActionResponse) => {
  formatMessageDateParam(response.record?.params, ADMIN_MESSAGE_CREATED_AT_PATH)
  formatMessageDateParam(response.record?.params, ADMIN_MESSAGE_EDITED_AT_PATH)
  response.records?.forEach((record) => {
    formatMessageDateParam(record.params, ADMIN_MESSAGE_CREATED_AT_PATH)
    formatMessageDateParam(record.params, ADMIN_MESSAGE_EDITED_AT_PATH)
  })

  return response
}

export const ADMIN_MESSAGE_OPTIONS = {
  resource: MessageModel,
  options: {
    id: 'messages',
    navigation: 'Messages',
    titleProperty: '_id',
    sort: {
      sortBy: ADMIN_MESSAGE_CREATED_AT_PATH,
      direction: 'desc'
    },
    listProperties: ['_id', 'authorNickname', 'authorId', 'body', ADMIN_MESSAGE_CREATED_AT_PATH],
    showProperties: [
      '_id',
      'authorId',
      'authorNickname',
      'body',
      ADMIN_MESSAGE_CREATED_AT_PATH,
      ADMIN_MESSAGE_EDITED_AT_PATH,
      'reactions',
      'images',
      'documents',
      'audios',
      'videos',
      'imageCompression',
      'linkPreview',
      'deletedForUserIds',
      'usersMetaData',
      'repliedMessage'
    ],
    filterProperties: ['_id', 'authorId', 'authorNickname', 'body', ADMIN_MESSAGE_CREATED_AT_PATH],
    actions: {
      new: {
        isAccessible: false
      },
      edit: {
        isAccessible: false
      },
      delete: {
        isAccessible: false
      },
      bulkDelete: {
        isAccessible: false
      },
      list: {
        after: async (response: AdminMessageActionResponse) => withFormattedMessageDates(response)
      },
      show: {
        after: async (response: AdminMessageActionResponse) => withFormattedMessageDates(response)
      }
    },
    properties: {
      _id: {
        label: 'ID'
      },
      authorId: {
        label: 'Author ID'
      },
      authorNickname: {
        label: 'Author'
      },
      body: {
        label: 'Body'
      },
      [ADMIN_MESSAGE_CREATED_AT_PATH]: {
        label: 'Created At'
      },
      [ADMIN_MESSAGE_EDITED_AT_PATH]: {
        label: 'Edited At'
      },
      deletedForUserIds: {
        label: 'Deleted For User IDs'
      },
      usersMetaData: {
        label: 'Users Metadata'
      },
      repliedMessage: {
        label: 'Replied Message'
      }
    }
  }
}
