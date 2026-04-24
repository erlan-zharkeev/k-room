import bcrypt from 'bcryptjs'
import { DEFAULT_APP_LANGUAGE, formatHumanDateTime, isNumber, isString, type UnknownObject } from 'global-shared'

import { localizedText } from 'src/shared/lib/localized-text'

import { LAST_SEEN_PATH } from './user.constants'
import { USER_ADMIN_I18N } from './user.i18n'
import { UserModel } from './user.model'

const formatLastSeenParam = (params?: UnknownObject) => {
  if (!params) {
    return
  }

  const value = params[LAST_SEEN_PATH]
  if (!isNumber(value) && !isString(value)) {
    return
  }

  params[LAST_SEEN_PATH] = formatHumanDateTime(value)
}

const withFormattedLastSeen = (response: {
  record?: { params?: UnknownObject }
  records?: Array<{ params?: UnknownObject }>
}) => {
  formatLastSeenParam(response.record?.params)
  response.records?.forEach((record) => formatLastSeenParam(record.params))

  return response
}

const normalizePassword = async (
  request: {
    method?: string
    payload?: UnknownObject
  },
  isRequired: boolean
) => {
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
        before: async (request: { method?: string; payload?: UnknownObject }) => normalizePassword(request, true)
      },
      edit: {
        before: async (request: { method?: string; payload?: UnknownObject }) => normalizePassword(request, false)
      },
      list: {
        after: async (response: { record?: { params?: UnknownObject }; records?: Array<{ params?: UnknownObject }> }) =>
          withFormattedLastSeen(response)
      },
      show: {
        after: async (response: { record?: { params?: UnknownObject }; records?: Array<{ params?: UnknownObject }> }) =>
          withFormattedLastSeen(response)
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
