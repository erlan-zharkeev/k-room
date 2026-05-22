import type { SocketAckResponse, SocketActions } from 'global-shared'

import { SOCKET_ACTION_ACK_TIMEOUT_MS } from './constants'
import { socket } from './socket'
import type { EmitSocketActionOptions } from './types'

export const useSocketAction = () => {
  const emitSocketAction = <TPayload, TResponsePayload = void, TReason extends string = string>(
    event: SocketActions,
    payload: TPayload,
    options: EmitSocketActionOptions<TResponsePayload, TReason> = {}
  ) => {
    return new Promise<SocketAckResponse<TResponsePayload, TReason>>((resolve) => {
      socket
        .timeout(SOCKET_ACTION_ACK_TIMEOUT_MS)
        .emit(event, payload, (error: Error | null, response?: SocketAckResponse<TResponsePayload, TReason>) => {
          const normalizedResponse: SocketAckResponse<TResponsePayload, TReason> =
            error || !response ? { ok: false } : response

          if (normalizedResponse.ok) {
            options.onSuccess?.(normalizedResponse)
          } else {
            options.onFailure?.(normalizedResponse)
          }

          options.onSettled?.()
          resolve(normalizedResponse)
        })
    })
  }

  return {
    emitSocketAction
  }
}
