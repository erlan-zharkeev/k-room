import bcrypt from 'bcryptjs'
import {
  DEFAULT_APP_LANGUAGE,
  formatHumanDateTime,
  isNumber,
  isString,
  isUnknownObject,
  type UnknownObject
} from 'global-shared'
import { Types, type FilterQuery, type SortOrder } from 'mongoose'

import { localizedText } from 'src/shared/lib/localized-text'

import { LAST_SEEN_PATH } from './user.constants'
import { USER_ADMIN_I18N } from './user.i18n'
import { UserModel } from './user.model'
import type { AdminUserActionRequest, AdminUserActionResponse, AdminUserRecord, UserSchema } from './user.types'

const ADMIN_USER_LIST_PER_PAGE_LIMIT = 500
const ADMIN_USER_DEFAULT_PER_PAGE = 10
const ADMIN_USER_DEFAULT_PAGE = 1
const ADMIN_USER_DEFAULT_SORT_BY = '_id'
const ADMIN_USER_SORT_PATHS = [
  '_id',
  'public.nickname',
  'personal.email',
  'system.role',
  LAST_SEEN_PATH,
  'createdAt',
  'updatedAt'
] as const

interface AdminUserListActionRequest {
  query?: UnknownObject
}

interface AdminUserListActionContext {
  currentAdmin?: unknown
  resource: {
    build: (params: UnknownObject) => {
      toJSON: (currentAdmin?: unknown) => AdminUserRecord
    }
  }
}

interface AdminUserListActionResponse extends AdminUserActionResponse {
  meta: {
    total: number
    perPage: number
    page: number
    direction: 'asc' | 'desc'
    sortBy: string
  }
}

interface AdminUserListQueryParams {
  direction: 'asc' | 'desc'
  page: number
  perPage: number
  sortBy: string
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getNestedValue = (source: unknown, path: string): unknown => {
  if (!isUnknownObject(source)) {
    return
  }

  if (Object.prototype.hasOwnProperty.call(source, path)) {
    return source[path]
  }

  return path.split('.').reduce<unknown>((value, key) => (isUnknownObject(value) ? value[key] : undefined), source)
}

const getFilterValue = (query: UnknownObject, path: string) => {
  const filters = getNestedValue(query, 'filters')
  const nestedValue = getNestedValue(filters, path)

  if (typeof nestedValue !== 'undefined') {
    return nestedValue
  }

  return getNestedValue(query, `filters.${path}`)
}

const getStringParam = (value: unknown) => (isString(value) ? value.trim() : '')

const getPositiveNumberParam = (value: unknown, fallback: number) => {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return fallback
  }

  return numberValue
}

const getUserListQueryParams = (query: UnknownObject = {}): AdminUserListQueryParams => {
  const page = getPositiveNumberParam(getNestedValue(query, 'page'), ADMIN_USER_DEFAULT_PAGE)
  const perPage = Math.min(
    getPositiveNumberParam(getNestedValue(query, 'perPage'), ADMIN_USER_DEFAULT_PER_PAGE),
    ADMIN_USER_LIST_PER_PAGE_LIMIT
  )
  const direction: AdminUserListQueryParams['direction'] =
    getNestedValue(query, 'direction') === 'desc' ? 'desc' : 'asc'
  const requestedSortBy = getStringParam(getNestedValue(query, 'sortBy'))
  const sortBy = ADMIN_USER_SORT_PATHS.some((path) => path === requestedSortBy)
    ? requestedSortBy
    : ADMIN_USER_DEFAULT_SORT_BY

  return {
    direction,
    page,
    perPage,
    sortBy
  }
}

const buildStringRegExpFilter = (value: string) => new RegExp(escapeRegExp(value), 'i')

const buildUserListFilter = (query: UnknownObject = {}) => {
  const filter: FilterQuery<UserSchema> = {}
  const id = getStringParam(getFilterValue(query, '_id'))
  const nickname = getStringParam(getFilterValue(query, 'public.nickname'))
  const email = getStringParam(getFilterValue(query, 'personal.email'))
  const role = getStringParam(getFilterValue(query, 'system.role'))
  const provider = getStringParam(getFilterValue(query, 'system.provider'))

  if (id) {
    filter._id = Types.ObjectId.isValid(id) ? id : null
  }

  if (nickname) {
    filter['public.nickname'] = buildStringRegExpFilter(nickname)
  }

  if (email) {
    filter['personal.email'] = buildStringRegExpFilter(email)
  }

  if (role) {
    filter['system.role'] = role
  }

  if (provider) {
    filter['system.provider'] = provider
  }

  return filter
}

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

const listUsers = async (
  request: AdminUserListActionRequest,
  response: unknown,
  context: AdminUserListActionContext
): Promise<AdminUserListActionResponse> => {
  const query = request.query || {}
  const { direction, page, perPage, sortBy } = getUserListQueryParams(query)
  const filter = buildUserListFilter(query)
  const sort: Record<string, SortOrder> = {
    [sortBy]: direction
  }
  const [users, total] = await Promise.all([
    UserModel.find(filter)
      .sort(sort)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean<UnknownObject[]>(),
    UserModel.countDocuments(filter)
  ])

  void response

  return {
    meta: {
      total,
      perPage,
      page,
      direction,
      sortBy
    },
    records: users.map((user) => context.resource.build(user).toJSON(context.currentAdmin))
  }
}

export const ADMIN_USER_OPTIONS = {
  resource: UserModel,
  options: {
    id: 'users',
    navigation: 'Users',
    titleProperty: 'public.nickname',
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
        handler: listUsers,
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
