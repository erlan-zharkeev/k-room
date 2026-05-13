import type { ISocketAckFailure, ISocketAckSuccess } from 'global-shared'

export interface IEmitSocketActionOptions<TResponsePayload = void, TReason extends string = string> {
  onSuccess?: (response: ISocketAckSuccess<TResponsePayload>) => void
  onFailure?: (response: ISocketAckFailure<TReason>) => void
  onSettled?: () => void
}
