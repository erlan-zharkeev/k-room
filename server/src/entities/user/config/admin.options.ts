import { formatHumanDateTime } from 'common'

import { UserModel } from './../model'

const LAST_SEEN_PATH = 'public.lastSeen'

type AdminRecordType = {
  params?: Record<string, unknown>
}

type AdminActionResponseType = {
  record?: AdminRecordType
  records?: AdminRecordType[]
}

const formatLastSeenParam = (params?: Record<string, unknown>) => {
  if (!params) return

  const value = params[LAST_SEEN_PATH]
  if (typeof value !== 'number' && typeof value !== 'string') return

  params[LAST_SEEN_PATH] = formatHumanDateTime(value)
}

const withFormattedLastSeen = <T extends AdminActionResponseType>(response: T) => {
  formatLastSeenParam(response.record?.params)
  response.records?.forEach((record) => formatLastSeenParam(record.params))

  return response
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
      'personal.infoNotifications',
      'system.role',
      'system.provider',
      'system.confirmed',
      'system.confirmAttempts'
    ],
    editProperties: ['public.username', 'personal.email', 'system.role', 'system.provider', 'system.confirmed'],
    filterProperties: ['_id', 'public.username', 'personal.email', 'system.role', 'public.online', 'system.provider'],
    actions: {
      list: {
        after: async (response: AdminActionResponseType) => withFormattedLastSeen(response)
      },
      show: {
        after: async (response: AdminActionResponseType) => withFormattedLastSeen(response)
      }
    },
    properties: {
      'system.password': {
        isVisible: false
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
      'personal.infoNotifications': {
        label: 'Info Notifications'
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
