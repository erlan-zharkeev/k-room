import type { firebaseProviders, providers } from './constants'

export type AuthTokens = 'jwt' | 'refresh-jwt'

export type FirebaseProvider = (typeof firebaseProviders)[number]
export type Provider = (typeof providers)[number]

export type AvailableCookie = 'device-id' | AuthTokens

export type UnknownCallback = (...args: unknown[]) => unknown
export type UnknownObject = { [key: string]: unknown }

export interface BasicStreamSettings {
  audio: boolean
  video: boolean
}

export interface StreamSettings extends BasicStreamSettings {
  streamLoading: boolean
}

export interface BackendMessage {
  text: string
  silent: boolean
}

export interface BackendResponse<T> {
  payload: T
  message: BackendMessage
}

export interface TransportMeta {
  clientVersion: string
}

export interface NativeAuthSession {
  accessToken: string
  deviceId: string
  refreshToken: string
}

export type { RouteName, Endpoints } from '../endpoints/types'
