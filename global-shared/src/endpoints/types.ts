import type {
  ADMIN_ENDPOINTS,
  AUTH_ENDPOINTS,
  CODES_ENDPOINTS,
  MEDIA_ENDPOINTS,
  ROUTE_NAMES,
  USER_ENDPOINTS
} from './constants'

type ValueOfType<T> = T[keyof T]

export type RouteNameType = ValueOfType<typeof ROUTE_NAMES>
export type EndpointsType =
  | ValueOfType<typeof AUTH_ENDPOINTS>
  | ValueOfType<typeof USER_ENDPOINTS>
  | ValueOfType<typeof CODES_ENDPOINTS>
  | ValueOfType<typeof ADMIN_ENDPOINTS>
  | ValueOfType<typeof MEDIA_ENDPOINTS>
