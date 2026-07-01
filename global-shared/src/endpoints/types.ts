import type {
  ADMIN_ENDPOINTS,
  APP_ROUTE_PATHS,
  AUTH_ENDPOINTS,
  CODES_ENDPOINTS,
  CLIENT_RUNTIME_ENDPOINTS,
  MONITORING_ENDPOINTS,
  MEDIA_ENDPOINTS,
  NOTIFICATION_ENDPOINTS,
  ROUTE_NAMES,
  USER_ENDPOINTS
} from './constants'

type ValueOf<T> = T[keyof T]

export type RouteName = ValueOf<typeof ROUTE_NAMES>
export type AppRoutePath = ValueOf<typeof APP_ROUTE_PATHS>
export type Endpoints =
  | ValueOf<typeof AUTH_ENDPOINTS>
  | ValueOf<typeof USER_ENDPOINTS>
  | ValueOf<typeof CODES_ENDPOINTS>
  | ValueOf<typeof ADMIN_ENDPOINTS>
  | ValueOf<typeof MONITORING_ENDPOINTS>
  | ValueOf<typeof CLIENT_RUNTIME_ENDPOINTS>
  | ValueOf<typeof NOTIFICATION_ENDPOINTS>
  | ValueOf<typeof MEDIA_ENDPOINTS>
