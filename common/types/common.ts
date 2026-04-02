export type AuthTokensType = 'jwt' | 'refresh-jwt'

export const firebaseProviders = ['google', 'facebook'] as const
export type FirebaseProviderType = (typeof firebaseProviders)[number]

export const providers = [...firebaseProviders, 'app'] as const
export type ProviderType = (typeof providers)[number]

export type AvailableCookieType = 'device-id' | AuthTokensType

export type UnknownCallbackType = (...args: unknown[]) => unknown

export interface IBasicStreamSettings {
  audio: boolean
  video: boolean
}

export interface IStreamSettings extends IBasicStreamSettings {
  streamLoading: boolean
}

export interface IBackendMessage {
  text: string
  silent: boolean
}

export interface IBackendResponse<T> {
  payload: T
  message: IBackendMessage
}

type ValueOf<T> = T[keyof T]

export type RouteNameType = ValueOf<typeof import('./constants').ROUTE_NAMES>
export type EndpointsType =
  | ValueOf<typeof import('./constants').AUTH_ENDPOINTS>
  | ValueOf<typeof import('./constants').USER_ENDPOINTS>
  | ValueOf<typeof import('./constants').CODES_ENDPOINTS>
  | ValueOf<typeof import('./constants').ADMIN_ENDPOINTS>
  | ValueOf<typeof import('./constants').MEDIA_ENDPOINTS>
