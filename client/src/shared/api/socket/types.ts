import type { SocketAckFailure, SocketAckSuccess } from 'global-shared'

export interface EmitSocketActionOptions<TResponsePayload = void, TReason extends string = string> {
  onSuccess?: (response: SocketAckSuccess<TResponsePayload>) => void
  onFailure?: (response: SocketAckFailure<TReason>) => void
  onSettled?: () => void
}
