import type { IBackendResponse, SocketActionsType, StatusEnum } from 'common-types'
import { type Response } from 'express'
import { getIO, log } from 'shared-lib'

export const throwHTTPError = (status: StatusEnum, res: Response | null, error: string, silent: boolean = false) => {
  log.error(`-${error}`)

  if (!res) return

  if (res.headersSent) {
    log.warn(`⚠️ Attempted to send error after headers were already sent: ${error}`)
    return
  }

  const payload: IBackendResponse<null> = {
    data: null,
    message: {
      text: error,
      silent
    }
  }

  return res.status(status).json(payload)
}

export const throwSocketError = (
  socketId: string,
  error: string = 'Unknown error',
  status: StatusEnum | undefined = 500,
  silent: boolean = false
) => {
  const io = getIO()
  io.to(socketId).emit<SocketActionsType>('error-message', { error, silent, status })
}
