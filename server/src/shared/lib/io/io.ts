import { Server } from 'socket.io'

let io: Server | null = null

export const setIO = (data: Server) => {
  io = data
}

export const getIO = (): Server => {
  if (!io) throw new Error('io not initialized')
  return io
}
