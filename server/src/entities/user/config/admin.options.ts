import { ActionRequest, ValidationError } from 'adminjs'

import { DEFAULT_APP_LANGUAGE, formatHumanDateTime } from 'common'

import { localizedText } from 'src/shared/lib'

import { UserModel } from './../model'
import { IAdminActionResponse, LAST_SEEN_PATH, USER_ADMIN_I18N } from './index'

const formatLastSeenParam = (params?: Record<string, unknown>) => {
  if (!params) return

  const value = params[LAST_SEEN_PATH]
  if (typeof value !== 'number' && typeof value !== 'string') return

  params[LAST_SEEN_PATH] = formatHumanDateTime(value)
}

const withFormattedLastSeen = <T extends IAdminActionResponse>(response: T) => {
  formatLastSeenParam(response.record?.params)
  response.records?.forEach((record) => formatLastSeenParam(record.params))

  return response
}

const validateUserCreateRequest = async (request: ActionRequest) => {
  if (request.method !== 'post') return request

  const password = request.payload?.['system.password']

  if (typeof password === 'string' && password.trim()) return request

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
    listProperties: ['_id', 'public.username', 'personal.email', 'system.role', 'public.online', LAST_SEEN_PATH],
    showProperties: [
      '_id',
      'public.username',
      'public.online',
      LAST_SEEN_PATH,
      'personal.email',
      'personal.chatRooms',
      'system.role',
      'system.provider',
      'system.confirmed',
      'system.confirmAttempts'
    ],
    newProperties: ['public.username', 'personal.email', 'system.password', 'system.role', 'system.provider', 'system.confirmed'],
    editProperties: ['public.username', 'personal.email', 'system.role', 'system.provider', 'system.confirmed'],
    filterProperties: ['_id', 'public.username', 'personal.email', 'system.role', 'public.online', 'system.provider'],
    actions: {
      new: {
        before: validateUserCreateRequest
      },
      list: {
        after: async (response: IAdminActionResponse) => withFormattedLastSeen(response)
      },
      show: {
        after: async (response: IAdminActionResponse) => withFormattedLastSeen(response)
      }
    },
    properties: {
      'system.password': {
        type: 'password',
        isVisible: {
          show: false,
          list: false,
          filter: false,
          edit: true
        },
        isRequired: true,
        label: 'Password'
      },
      'system.device': {
        isVisible: false
      },
      'personal.contacts': {
        isVisible: false
      },
      'public.username': {
        label: 'Username'
      },
      'personal.email': {
        label: 'Email'
      },
      'system.role': {
        label: 'Role'
      },
      'public.online': {
        label: 'Online'
      },
      [LAST_SEEN_PATH]: {
        label: 'Last Seen'
      },
      'personal.chatRooms': {
        label: 'Chat Rooms'
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
