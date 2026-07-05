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

import {
  ADMIN_USER_DEFAULT_PAGE,
  ADMIN_USER_DEFAULT_PER_PAGE,
  ADMIN_USER_DEFAULT_SORT_BY,
  ADMIN_USER_LIST_PER_PAGE_LIMIT,
  ADMIN_USER_SORT_PATHS,
  LAST_SEEN_PATH,
  USER_PASSWORD_PATH
} from './user.constants'
import { USER_ADMIN_I18N } from './user.i18n'
import { UserModel } from './user.model'
import type {
  AdminUserActionRequest,
  AdminUserActionResponse,
  AdminUserListActionContext,
  AdminUserListActionRequest,
  AdminUserListActionResponse,
  AdminUserListQueryParams,
  AdminUserRecord,
  UserSchema
} from './user.types'

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

const clearPasswordParam = (params?: AdminUserRecord['params']) => {
  if (!params) {
    return
  }

  const system = params.system

  params[USER_PASSWORD_PATH] = ''

  if (isUnknownObject(system)) {
    system.password = ''
  }
}

const withHiddenPassword = (response: AdminUserActionResponse) => {
  clearPasswordParam(response.record?.params)
  response.records?.forEach((record) => clearPasswordParam(record.params))

  return response
}

const withFormattedLastSeen = (response: AdminUserActionResponse) => {
  formatLastSeenParam(response.record?.params)
  response.records?.forEach((record) => formatLastSeenParam(record.params))

  return response
}

const withSafeUserAdminResponse = (response: AdminUserActionResponse) => {
  withFormattedLastSeen(response)
  withHiddenPassword(response)

  return response
}

const normalizePassword = async (request: AdminUserActionRequest, isRequired: boolean) => {
  if (request.method !== 'post') {
    return request
  }

  const password = request.payload?.[USER_PASSWORD_PATH]

  if (isString(password) && password.trim()) {
    request.payload = {
      ...request.payload,
      [USER_PASSWORD_PATH]: await bcrypt.hash(password, 6)
    }

    return request
  }

  if (!request.payload) {
    return request
  }

  if (!isRequired) {
    delete request.payload[USER_PASSWORD_PATH]
    return request
  }

  const { ValidationError } = await import('adminjs')

  throw new ValidationError(
    {
      [USER_PASSWORD_PATH]: {
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
      USER_PASSWORD_PATH,
      'system.role',
      'system.provider',
      'system.confirmed'
    ],
    editProperties: [
      'public.nickname',
      'personal.email',
      USER_PASSWORD_PATH,
      'system.role',
      'system.provider',
      'system.confirmed'
    ],
    filterProperties: ['_id', 'public.nickname', 'personal.email', 'system.role', 'system.provider'],
    actions: {
      new: {
        before: async (request: AdminUserActionRequest) => normalizePassword(request, true),
        after: async (response: AdminUserActionResponse) => withHiddenPassword(response)
      },
      edit: {
        before: async (request: AdminUserActionRequest) => normalizePassword(request, false),
        after: async (response: AdminUserActionResponse) => withHiddenPassword(response)
      },
      list: {
        handler: listUsers,
        after: async (response: AdminUserActionResponse) => withSafeUserAdminResponse(response)
      },
      show: {
        after: async (response: AdminUserActionResponse) => withSafeUserAdminResponse(response)
      }
    },
    properties: {
      [USER_PASSWORD_PATH]: {
        isRequired: true,
        isVisible: true,
        label: 'Password',
        props: {
          autoComplete: 'new-password'
        },
        type: 'password'
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
