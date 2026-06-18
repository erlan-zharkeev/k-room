import type {
  ClientToServerSocketAckAction,
  ClientToServerSocketAckPayloadMap,
  ClientToServerSocketPayloadMap,
  SocketAckFailure,
  SocketAckResponse,
  SocketAckSuccess
} from 'global-shared'

import type { SOCKET_AVAILABILITY_STATUS } from './constants'
import type { socket } from './socket'

export type SocketAvailabilityStatus = (typeof SOCKET_AVAILABILITY_STATUS)[keyof typeof SOCKET_AVAILABILITY_STATUS]

export interface EmitSocketActionOptions<TResponsePayload = void, TReason extends string = string> {
  onSuccess?: (response: SocketAckSuccess<TResponsePayload>) => void
  onFailure?: (response: SocketAckFailure<TReason>) => void
  onSettled?: () => void
}

export type EmitSocketActionWithAck = <TEvent extends ClientToServerSocketAckAction, TReason extends string = string>(
  event: TEvent,
  payload: ClientToServerSocketPayloadMap[TEvent]
) => Promise<SocketAckResponse<ClientToServerSocketAckPayloadMap[TEvent], TReason>>

export type SocketWithAck = typeof socket & {
  emitWithAck: EmitSocketActionWithAck
}
