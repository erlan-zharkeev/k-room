export type AuthTokensType = 'jwt' | 'refresh-jwt'

export type FirebaseProviderType = (typeof import('./constants').firebaseProviders)[number]
export type ProviderType = (typeof import('./constants').providers)[number]

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

export type { RouteNameType, EndpointsType } from '../../endpoints/config'
