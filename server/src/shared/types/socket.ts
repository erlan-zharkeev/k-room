import type {
  AppLanguage,
  ClientToServerSocketEvents,
  ServerToClientSocketAction,
  ServerToClientSocketEvents,
  ServerToClientSocketPayloadMap
} from 'global-shared'
import type { DefaultEventsMap, Server, Socket } from 'socket.io'

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
