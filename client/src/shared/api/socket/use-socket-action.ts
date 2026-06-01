import type {
  ClientToServerSocketAckAction,
  ClientToServerSocketAckPayloadMap,
  ClientToServerSocketPayloadMap,
  SocketAckResponse
} from 'global-shared'

import { TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { SOCKET_ACTION_ACK_TIMEOUT_MS } from './constants'
import { SOCKET_I18N } from './i18n'
import { socket } from './socket'
import type { EmitSocketActionOptions, EmitSocketActionWithAck } from './types'

export const useSocketAction = () => {
  const { t } = useI18n()
  const toast = useAppToast()

  const showSocketTransportError = () => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(SOCKET_I18N.transportError)
    })
  }

  const emitSocketAction = <TEvent extends ClientToServerSocketAckAction, TReason extends string = string>(
    event: TEvent,
    payload: ClientToServerSocketPayloadMap[TEvent],
    options: EmitSocketActionOptions<ClientToServerSocketAckPayloadMap[TEvent], TReason> = {}
  ) => {
    const emitWithAckSocket = socket.timeout(SOCKET_ACTION_ACK_TIMEOUT_MS) as typeof socket & {
      emitWithAck: EmitSocketActionWithAck
    }

    return emitWithAckSocket
      .emitWithAck<TEvent, TReason>(event, payload)
      .then((response: SocketAckResponse<ClientToServerSocketAckPayloadMap[TEvent], TReason>) => {
        if (response.ok) {
          options.onSuccess?.(response)
        } else {
          options.onFailure?.(response)
        }

        return response
      })
      .catch(() => {
        const response: SocketAckResponse<ClientToServerSocketAckPayloadMap[TEvent], TReason> = {
          ok: false,
          handledByGlobalError: true
        }

        showSocketTransportError()
        options.onFailure?.(response)

        return response
      })
      .finally(() => {
        options.onSettled?.()
      })
  }

  return {
    emitSocketAction
  }
}
