import { DEFAULT_APP_LANGUAGE, formatHumanDateTime } from 'common'

import { localizedText } from 'src/shared/lib/localized-text'

import { UserModel } from '../user.model'

import { LAST_SEEN_PATH } from './constants'
import { USER_ADMIN_I18N } from './i18n'
import { IAdminActionRequest, IAdminActionResponse } from '../types'

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

const validateUserCreateRequest = async (request: IAdminActionRequest) => {
  if (request.method !== 'post') return request

  const password = request.payload?.['system.password']

  if (typeof password === 'string' && password.trim()) return request

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
    newProperties: [
      'public.username',
      'personal.email',
      'system.password',
      'system.role',
      'system.provider',
      'system.confirmed'
    ],
    editProperties: [
      'public.username',
      'personal.email',
      'system.password',
      'system.role',
      'system.provider',
      'system.confirmed'
    ],
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
        isRequired: true,
        isVisible: true
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
