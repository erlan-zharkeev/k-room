import type {
  AppLanguage,
  ClientToServerSocketEvents,
  LocalizedText,
  ReqStatus,
  ServerToClientSocketAction,
  ServerToClientSocketEvents,
  ServerToClientSocketPayloadMap
} from 'global-shared'
import type { Types } from 'mongoose'
import type { DefaultEventsMap, Server, Socket } from 'socket.io'

export type MongoId = string | Types.ObjectId

export type SocketInstance = Socket<
  ClientToServerSocketEvents,
  ServerToClientSocketEvents,
  DefaultEventsMap,
  { userId: string; deviceId: string; language: AppLanguage }
>

export type SocketIO = Server<
  ClientToServerSocketEvents,
  ServerToClientSocketEvents,
  DefaultEventsMap,
  { userId: string; deviceId: string; language: AppLanguage }
>

export type EmitServerToClientSocketEvent = <TEvent extends ServerToClientSocketAction>(
  event: TEvent,
  ...payload: ServerToClientSocketPayloadMap[TEvent] extends void
    ? []
    : [payload: ServerToClientSocketPayloadMap[TEvent]]
) => boolean

export interface ThrowSocketErrorOptions {
  status?: ReqStatus
  silent?: boolean
  cause?: unknown
}

export interface SocketErrorMiddlewareOptions {
  basicError: LocalizedText<string>
  status?: ReqStatus
  silent?: boolean
}
