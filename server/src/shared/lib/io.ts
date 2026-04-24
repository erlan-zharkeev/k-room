import { REQ_STATUS } from 'global-shared'
import type { Server } from 'socket.io'

import { AppError } from './app-error'

let io: Server | null = null

export const setIO = (value: Server) => {
  io = value
}

export const getIO = () => {
  if (!io) {
    throw new AppError(REQ_STATUS.server, 'io not initialized')
  }

  return io
}
