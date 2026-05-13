import type { SocketAckResponseType, SocketActionsType } from 'global-shared'

import { SOCKET_ACTION_ACK_TIMEOUT_MS } from './constants'
import { socket } from './socket'
import type { IEmitSocketActionOptions } from './types'

export const useSocketAction = () => {
  const emitSocketAction = <TPayload, TResponsePayload = void, TReason extends string = string>(
    event: SocketActionsType,
    payload: TPayload,
    options: IEmitSocketActionOptions<TResponsePayload, TReason> = {}
  ) => {
    return new Promise<SocketAckResponseType<TResponsePayload, TReason>>((resolve) => {
      socket
        .timeout(SOCKET_ACTION_ACK_TIMEOUT_MS)
        .emit(event, payload, (error: Error | null, response?: SocketAckResponseType<TResponsePayload, TReason>) => {
          const normalizedResponse: SocketAckResponseType<TResponsePayload, TReason> =
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
