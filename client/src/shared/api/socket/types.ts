import type {
  ClientToServerSocketAckAction,
  ClientToServerSocketAckPayloadMap,
  ClientToServerSocketPayloadMap,
  SocketAckFailure,
  SocketAckResponse,
  SocketAckSuccess
} from 'global-shared'

export interface EmitSocketActionOptions<TResponsePayload = void, TReason extends string = string> {
  onSuccess?: (response: SocketAckSuccess<TResponsePayload>) => void
  onFailure?: (response: SocketAckFailure<TReason>) => void
  onSettled?: () => void
}

export type EmitSocketActionWithAck = <TEvent extends ClientToServerSocketAckAction, TReason extends string = string>(
  event: TEvent,
  payload: ClientToServerSocketPayloadMap[TEvent]
) => Promise<SocketAckResponse<ClientToServerSocketAckPayloadMap[TEvent], TReason>>
