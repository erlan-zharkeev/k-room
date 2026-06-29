import { formatHumanDateTime, isNumber, isString } from 'global-shared'

import {
  ADMIN_ROOM_CALL_CALLED_AT_PATH,
  ADMIN_ROOM_CALL_FINISHED_AT_PATH,
  ADMIN_ROOM_CALL_STARTED_AT_PATH
} from './room-calls.constants'
import { RoomCallModel } from './room-calls.model'
import type { AdminRoomCallActionResponse, AdminRoomCallRecord } from './room-calls.types'

const formatRoomCallDateParam = (params: AdminRoomCallRecord['params'], path: string) => {
  if (!params) {
    return
  }

  const value = params[path]
  if (!isNumber(value) && !isString(value)) {
    return
  }

  params[path] = formatHumanDateTime(value)
}

const withFormattedRoomCallDates = (response: AdminRoomCallActionResponse) => {
  formatRoomCallDateParam(response.record?.params, ADMIN_ROOM_CALL_CALLED_AT_PATH)
  formatRoomCallDateParam(response.record?.params, ADMIN_ROOM_CALL_STARTED_AT_PATH)
  formatRoomCallDateParam(response.record?.params, ADMIN_ROOM_CALL_FINISHED_AT_PATH)
  response.records?.forEach((record) => {
    formatRoomCallDateParam(record.params, ADMIN_ROOM_CALL_CALLED_AT_PATH)
    formatRoomCallDateParam(record.params, ADMIN_ROOM_CALL_STARTED_AT_PATH)
    formatRoomCallDateParam(record.params, ADMIN_ROOM_CALL_FINISHED_AT_PATH)
  })

  return response
}

export const ADMIN_ROOM_CALL_OPTIONS = {
  resource: RoomCallModel,
  options: {
    id: 'room-calls',
    navigation: 'Room Calls',
    titleProperty: '_id',
    sort: {
      sortBy: ADMIN_ROOM_CALL_CALLED_AT_PATH,
      direction: 'desc'
    },
    listProperties: ['_id', 'roomId', 'initiatorId', 'status', 'mediaKind', ADMIN_ROOM_CALL_CALLED_AT_PATH],
    showProperties: [
      '_id',
      'roomId',
      'initiatorId',
      'status',
      'mediaKind',
      ADMIN_ROOM_CALL_CALLED_AT_PATH,
      ADMIN_ROOM_CALL_STARTED_AT_PATH,
      ADMIN_ROOM_CALL_FINISHED_AT_PATH,
      'participants'
    ],
    filterProperties: [
      '_id',
      'roomId',
      'initiatorId',
      'status',
      'mediaKind',
      ADMIN_ROOM_CALL_CALLED_AT_PATH,
      ADMIN_ROOM_CALL_STARTED_AT_PATH,
      ADMIN_ROOM_CALL_FINISHED_AT_PATH
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
        after: async (response: AdminRoomCallActionResponse) => withFormattedRoomCallDates(response)
      },
      show: {
        after: async (response: AdminRoomCallActionResponse) => withFormattedRoomCallDates(response)
      }
    },
    properties: {
      _id: {
        label: 'ID'
      },
      roomId: {
        label: 'Room ID'
      },
      initiatorId: {
        label: 'Initiator ID'
      },
      status: {
        label: 'Status'
      },
      mediaKind: {
        label: 'Media Kind'
      },
      [ADMIN_ROOM_CALL_CALLED_AT_PATH]: {
        label: 'Called At'
      },
      [ADMIN_ROOM_CALL_STARTED_AT_PATH]: {
        label: 'Started At'
      },
      [ADMIN_ROOM_CALL_FINISHED_AT_PATH]: {
        label: 'Finished At'
      }
    }
  }
}
