import bcrypt from 'bcryptjs'
import { DEFAULT_APP_LANGUAGE, formatHumanDateTime, isNumber, isString } from 'global-shared'

import { localizedText } from 'src/shared/lib/localized-text'

import { LAST_SEEN_PATH } from './user.constants'
import { USER_ADMIN_I18N } from './user.i18n'
import { UserModel } from './user.model'
import type { AdminUserActionRequest, AdminUserActionResponse, AdminUserRecord } from './user.types'

const formatLastSeenParam = (params?: AdminUserRecord['params']) => {
  if (!params) {
    return
  }

  const value = params[LAST_SEEN_PATH]
  if (!isNumber(value) && !isString(value)) {
    return
  }

  params[LAST_SEEN_PATH] = formatHumanDateTime(value)
}

const withFormattedLastSeen = (response: AdminUserActionResponse) => {
  formatLastSeenParam(response.record?.params)
  response.records?.forEach((record) => formatLastSeenParam(record.params))

  return response
}

const normalizePassword = async (request: AdminUserActionRequest, isRequired: boolean) => {
  if (request.method !== 'post') {
    return request
  }

  const password = request.payload?.['system.password']

  if (isString(password) && password.trim()) {
    request.payload = {
      ...request.payload,
      'system.password': await bcrypt.hash(password, 6)
    }

    return request
  }

  if (!request.payload) {
    return request
  }

  if (!isRequired) {
    delete request.payload['system.password']
    return request
  }

  const { ValidationError } = await import('adminjs')

  throw new ValidationError(
    {
      'system.password': {
        message: localizedText(USER_ADMIN_I18N.passwordRequired, DEFAULT_APP_LANGUAGE),
        type: 'required'
      }
    },
    {
      message: localizedText(USER_ADMIN_I18N.validationFailed, DEFAULT_APP_LANGUAGE),
      type: 'required'
    }
  )
}

export const ADMIN_USER_OPTIONS = {
  resource: UserModel,
  options: {
    id: 'users',
    navigation: 'Users',
    listProperties: ['_id', 'public.nickname', 'personal.email', 'system.role', LAST_SEEN_PATH],
    showProperties: [
      '_id',
      'public.nickname',
      LAST_SEEN_PATH,
      'personal.email',
      'personal.chatRooms',
      'personal.pinnedChatRoomIds',
      'personal.mutedChatRoomIds',
      'system.role',
      'system.provider',
      'system.confirmed',
      'system.confirmAttempts'
    ],
    newProperties: [
      'public.nickname',
      'personal.email',
      'system.password',
      'system.role',
      'system.provider',
      'system.confirmed'
    ],
    editProperties: [
      'public.nickname',
      'personal.email',
      'system.password',
      'system.role',
      'system.provider',
      'system.confirmed'
    ],
    filterProperties: ['_id', 'public.nickname', 'personal.email', 'system.role', 'system.provider'],
    actions: {
      new: {
        before: async (request: AdminUserActionRequest) => normalizePassword(request, true)
      },
      edit: {
        before: async (request: AdminUserActionRequest) => normalizePassword(request, false)
      },
      list: {
        after: async (response: AdminUserActionResponse) => withFormattedLastSeen(response)
      },
      show: {
        after: async (response: AdminUserActionResponse) => withFormattedLastSeen(response)
      }
    },
    properties: {
      'system.password': {
        type: 'password',
        isRequired: true,
        isVisible: true
      },
      'system.device': {
        isVisible: false
      },
      'personal.contacts': {
        isVisible: false
      },
      'public.nickname': {
        label: 'Nickname'
      },
      'personal.email': {
        label: 'Email'
      },
      'system.role': {
        label: 'Role'
      },
      [LAST_SEEN_PATH]: {
        label: 'Last Seen'
      },
      'personal.chatRooms': {
        label: 'Chat Rooms'
      },
      'personal.pinnedChatRoomIds': {
        label: 'Pinned Chat Room IDs'
      },
      'personal.mutedChatRoomIds': {
        label: 'Muted Chat Room IDs'
      },
      'system.provider': {
        label: 'Provider'
      },
      'system.confirmed': {
        label: 'Confirmed'
      },
      'system.confirmAttempts': {
        label: 'Confirm Attempts'
      }
    }
  }
}
