import { formatHumanDateTime, isNumber, isString } from 'global-shared'

import { ADMIN_CHAT_ROOM_CREATED_AT_PATH } from './chat-rooms.constants'
import { ChatRoomModel } from './chat-rooms.model'
import type { AdminChatRoomActionResponse, AdminChatRoomRecord } from './chat-rooms.types'

const formatChatRoomDateParam = (params: AdminChatRoomRecord['params'], path: string) => {
  if (!params) {
    return
  }

  const value = params[path]
  if (!isNumber(value) && !isString(value)) {
    return
  }

  params[path] = formatHumanDateTime(value)
}

const withFormattedChatRoomDates = (response: AdminChatRoomActionResponse) => {
  formatChatRoomDateParam(response.record?.params, ADMIN_CHAT_ROOM_CREATED_AT_PATH)
  response.records?.forEach((record) => formatChatRoomDateParam(record.params, ADMIN_CHAT_ROOM_CREATED_AT_PATH))

  return response
}

export const ADMIN_CHAT_ROOM_OPTIONS = {
  resource: ChatRoomModel,
  options: {
    id: 'chat-rooms',
    navigation: 'Chat Rooms',
    titleProperty: '_id',
    sort: {
      sortBy: ADMIN_CHAT_ROOM_CREATED_AT_PATH,
      direction: 'desc'
    },
    listProperties: ['_id', 'chatName', 'chatKind', 'adminId', ADMIN_CHAT_ROOM_CREATED_AT_PATH],
    showProperties: [
      '_id',
      'chatName',
      'chatKind',
      'adminId',
      ADMIN_CHAT_ROOM_CREATED_AT_PATH,
      'avatarId',
      'users',
      'messages',
      'pinnedMessageId'
    ],
    filterProperties: [
      '_id',
      'chatName',
      'chatKind',
      'adminId',
      'users',
      'messages',
      'pinnedMessageId',
      ADMIN_CHAT_ROOM_CREATED_AT_PATH
    ],
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
        after: async (response: AdminChatRoomActionResponse) => withFormattedChatRoomDates(response)
      },
      show: {
        after: async (response: AdminChatRoomActionResponse) => withFormattedChatRoomDates(response)
      }
    },
    properties: {
      _id: {
        label: 'ID'
      },
      chatName: {
        label: 'Name'
      },
      chatKind: {
        label: 'Kind'
      },
      adminId: {
        label: 'Admin ID'
      },
      [ADMIN_CHAT_ROOM_CREATED_AT_PATH]: {
        label: 'Created At'
      },
      avatarId: {
        label: 'Avatar ID'
      },
      pinnedMessageId: {
        label: 'Pinned Message ID'
      }
    }
  }
}
