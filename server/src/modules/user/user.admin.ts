import bcrypt from 'bcryptjs'
import { formatHumanDateTime } from 'shared'

import { UserModel } from './user.model'

const LAST_SEEN_PATH = 'public.lastSeen'

const formatLastSeenParam = (params?: Record<string, unknown>) => {
  if (!params) {
    return
  }

  const value = params[LAST_SEEN_PATH]
  if (typeof value !== 'number' && typeof value !== 'string') {
    return
  }

  params[LAST_SEEN_PATH] = formatHumanDateTime(value)
}

const withFormattedLastSeen = (response: {
  record?: { params?: Record<string, unknown> }
  records?: Array<{ params?: Record<string, unknown> }>
}) => {
  formatLastSeenParam(response.record?.params)
  response.records?.forEach((record) => formatLastSeenParam(record.params))

  return response
}

const normalizePassword = async (
  request: {
    method?: string
    payload?: Record<string, unknown>
  },
  isRequired: boolean
) => {
  if (request.method !== 'post') {
    return request
  }

  const password = request.payload?.['system.password']

  if (typeof password === 'string' && password.trim()) {
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
        message: 'Password is required when creating a user from admin panel',
        type: 'required'
      }
    },
    {
      message: 'User form contains validation errors',
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
        before: async (request: { method?: string; payload?: Record<string, unknown> }) =>
          normalizePassword(request, true)
      },
      edit: {
        before: async (request: { method?: string; payload?: Record<string, unknown> }) =>
          normalizePassword(request, false)
      },
      list: {
        after: async (response: {
          record?: { params?: Record<string, unknown> }
          records?: Array<{ params?: Record<string, unknown> }>
        }) => withFormattedLastSeen(response)
      },
      show: {
        after: async (response: {
          record?: { params?: Record<string, unknown> }
          records?: Array<{ params?: Record<string, unknown> }>
        }) => withFormattedLastSeen(response)
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
