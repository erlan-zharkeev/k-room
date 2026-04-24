import type {
  ADMIN_ENDPOINTS,
  AUTH_ENDPOINTS,
  CODES_ENDPOINTS,
  MEDIA_ENDPOINTS,
  ROUTE_NAMES,
  USER_ENDPOINTS
} from './constants'

type ValueOf<T> = T[keyof T]

export type RouteNameType = ValueOf<typeof ROUTE_NAMES>
export type EndpointsType =
  | ValueOf<typeof AUTH_ENDPOINTS>
  | ValueOf<typeof USER_ENDPOINTS>
  | ValueOf<typeof CODES_ENDPOINTS>
  | ValueOf<typeof ADMIN_ENDPOINTS>
  | ValueOf<typeof MEDIA_ENDPOINTS>
