import type {
  ClientToServerSocketAckAction,
  ClientToServerSocketAckPayloadMap,
  ClientToServerSocketPayloadMap,
  SocketAckFailure,
  SocketAckResponse
} from 'global-shared'

import { TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { SOCKET_ACTION_ACK_TIMEOUT_MS } from './constants'
import { SOCKET_I18N } from './i18n'
import { socket } from './socket'
import type { EmitSocketActionOptions, EmitSocketActionWithAck } from './types'
import { useSocketAvailability } from './use-socket-availability'

export const useSocketAction = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { isSocketOnlineActionAvailable } = useSocketAvailability()

  const showSocketTransportError = () => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(SOCKET_I18N.transportError)
    })
  }

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

      showSocketTransportError()
      options.onFailure?.(response)
      options.onSettled?.()

      return response
    }

    const emitWithAckSocket = socket.timeout(SOCKET_ACTION_ACK_TIMEOUT_MS) as typeof socket & {
      emitWithAck: EmitSocketActionWithAck
    }

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

      showSocketTransportError()
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
