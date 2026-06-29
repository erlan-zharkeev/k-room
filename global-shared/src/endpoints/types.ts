import type {
  ADMIN_ENDPOINTS,
  AUTH_ENDPOINTS,
  CODES_ENDPOINTS,
  CLIENT_RUNTIME_ENDPOINTS,
  MONITORING_ENDPOINTS,
  MEDIA_ENDPOINTS,
  ROUTE_NAMES,
  USER_ENDPOINTS
} from './constants'

type ValueOf<T> = T[keyof T]

export type RouteName = ValueOf<typeof ROUTE_NAMES>
export type Endpoints =
  | ValueOf<typeof AUTH_ENDPOINTS>
  | ValueOf<typeof USER_ENDPOINTS>
  | ValueOf<typeof CODES_ENDPOINTS>
  | ValueOf<typeof ADMIN_ENDPOINTS>
  | ValueOf<typeof MONITORING_ENDPOINTS>
  | ValueOf<typeof CLIENT_RUNTIME_ENDPOINTS>
  | ValueOf<typeof MEDIA_ENDPOINTS>
