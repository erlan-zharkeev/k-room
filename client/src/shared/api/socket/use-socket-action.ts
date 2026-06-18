import type {
  ClientToServerSocketAckAction,
  ClientToServerSocketAckPayloadMap,
  ClientToServerSocketPayloadMap,
  SocketAckFailure,
  SocketAckResponse
} from 'global-shared'

import { SOCKET_ACTION_ACK_TIMEOUT_MS } from './constants'
import { socket } from './socket'
import type { EmitSocketActionOptions, SocketWithAck } from './types'
import { useSocketAvailability } from './use-socket-availability'
import { useSocketTransportErrorToast } from './use-socket-transport-error-toast'

export const useSocketAction = () => {
  const { isSocketOnlineActionAvailable } = useSocketAvailability()
  const { showSocketTransportErrorToast } = useSocketTransportErrorToast()

  const buildSocketTransportFailureResponse = <TReason extends string = string>(): SocketAckFailure<TReason> => ({
    ok: false,
    handledByGlobalError: true
  })

  const emitSocketAction = async <TEvent extends ClientToServerSocketAckAction, TReason extends string = string>(
    event: TEvent,
    payload: ClientToServerSocketPayloadMap[TEvent],
    options: EmitSocketActionOptions<ClientToServerSocketAckPayloadMap[TEvent], TReason> = {}
  ) => {
    if (!isSocketOnlineActionAvailable.value) {
      const response = buildSocketTransportFailureResponse<TReason>()

      showSocketTransportErrorToast()
      options.onFailure?.(response)
      options.onSettled?.()

      return response
    }

    const emitWithAckSocket = socket.timeout(SOCKET_ACTION_ACK_TIMEOUT_MS) as SocketWithAck

    try {
      const response = await emitWithAckSocket.emitWithAck<TEvent, TReason>(event, payload)

      if (response.ok) {
        options.onSuccess?.(response)
      } else {
        options.onFailure?.(response)
      }

      return response
    } catch {
      const response: SocketAckResponse<ClientToServerSocketAckPayloadMap[TEvent], TReason> =
        buildSocketTransportFailureResponse()

      showSocketTransportErrorToast()
      options.onFailure?.(response)

      return response
    } finally {
      options.onSettled?.()
    }
  }

  return {
    emitSocketAction
  }
}
