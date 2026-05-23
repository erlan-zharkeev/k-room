import type { SocketAckResponse, SocketActions } from 'global-shared'

import { TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { SOCKET_ACTION_ACK_TIMEOUT_MS } from './constants'
import { SOCKET_I18N } from './i18n'
import { socket } from './socket'
import type { EmitSocketActionOptions } from './types'

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

  const emitSocketAction = <TPayload, TResponsePayload = void, TReason extends string = string>(
    event: SocketActions,
    payload: TPayload,
    options: EmitSocketActionOptions<TResponsePayload, TReason> = {}
  ) => {
    return new Promise<SocketAckResponse<TResponsePayload, TReason>>((resolve) => {
      socket
        .timeout(SOCKET_ACTION_ACK_TIMEOUT_MS)
        .emit(event, payload, (error: Error | null, response?: SocketAckResponse<TResponsePayload, TReason>) => {
          const hasTransportError = Boolean(error || !response)
          const normalizedResponse: SocketAckResponse<TResponsePayload, TReason> =
            hasTransportError || !response ? { ok: false, handledByGlobalError: true } : response

          if (hasTransportError) {
            showSocketTransportError()
          }

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
