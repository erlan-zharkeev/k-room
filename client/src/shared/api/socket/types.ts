import type {
  ClientToServerSocketAckAction,
  ClientToServerSocketAckPayloadMap,
  ClientToServerSocketPayloadMap,
  ServerToClientSocketAction,
  ServerToClientSocketAckAction,
  ServerToClientSocketEvents,
  ServerToClientSocketPayloadMap,
  SocketAckFailure,
  SocketAckResponse,
  SocketAckSuccess
} from 'global-shared'

import type { socket } from './socket'

export type SocketAvailabilityStatus = 'online' | 'reconnecting' | 'offline'

export type SocketEventListener =
  | {
      [Event in ServerToClientSocketAction]: readonly [Event, ServerToClientSocketEvents[Event]]
    }[ServerToClientSocketAction]
  | readonly ['connect' | 'disconnect', () => void]

export type SocketAckEventListener = {
  [Event in ServerToClientSocketAckAction]: readonly [
    Event,
    (payload: ServerToClientSocketPayloadMap[Event]) => void | Promise<void>
  ]
}[ServerToClientSocketAckAction]

export interface EmitSocketActionOptions<TResponsePayload = void, TReason extends string = string> {
  onSuccess?: (response: SocketAckSuccess<TResponsePayload>) => void
  onFailure?: (response: SocketAckFailure<TReason>) => void
  onSettled?: () => void
  showTransportErrorToast?: boolean
  timeoutMs?: number
}

export type EmitSocketActionWithAck = <TEvent extends ClientToServerSocketAckAction, TReason extends string = string>(
  event: TEvent,
  ...args: [ClientToServerSocketPayloadMap[TEvent]] extends [void]
    ? [] | [payload: ClientToServerSocketPayloadMap[TEvent]]
    : [payload: ClientToServerSocketPayloadMap[TEvent]]
) => Promise<SocketAckResponse<ClientToServerSocketAckPayloadMap[TEvent], TReason>>

export type SocketWithAck = typeof socket & {
  emitWithAck: EmitSocketActionWithAck
}
