import type { Response } from 'express'
import {
  CLIENT_VERSION_HEADER,
  type ServerToClientSocketAction,
  type ServerToClientSocketPayloadMap
} from 'global-shared'

import { SERVER_ENV } from 'src/app/env'
import type { EmitServerToClientSocketEvent } from 'src/shared/types'

export const buildTransportMeta = () => ({
  clientVersion: SERVER_ENV.info.clientAppVersion
})

export const setClientVersionHeader = (response: Response) => {
  response.setHeader(CLIENT_VERSION_HEADER, SERVER_ENV.info.clientAppVersion)
}

export const withTransportMeta = <TResponse extends object>(response: TResponse) => ({
  ...response,
  meta: buildTransportMeta()
})

export const emitSocketEvent = <TEvent extends ServerToClientSocketAction>(
  emit: EmitServerToClientSocketEvent,
  event: TEvent,
  ...payload: ServerToClientSocketPayloadMap[TEvent] extends void
    ? []
    : [payload: ServerToClientSocketPayloadMap[TEvent]]
) => {
  const emitWithMeta = emit as (event: TEvent, ...args: unknown[]) => boolean

  emitWithMeta(event, ...payload, buildTransportMeta())
}
