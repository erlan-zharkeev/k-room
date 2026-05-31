import { REQ_STATUS } from 'global-shared'

import type { SocketIO } from '../types/socket'

import { AppError } from './app-error'

let io: SocketIO | null = null

export const setIO = (value: SocketIO) => {
  io = value
}

export const getIO = () => {
  if (!io) {
    throw new AppError(REQ_STATUS.server, 'io not initialized')
  }

  return io
}
