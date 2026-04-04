import { Server } from 'socket.io'

import { StatusEnum } from 'common'

import { AppError } from './../app-error'

let io: Server | null = null

export const setIO = (data: Server) => {
  io = data
}

export const getIO = (): Server => {
  if (!io) throw new AppError(StatusEnum.Server, 'io not initialized')
  return io
}
