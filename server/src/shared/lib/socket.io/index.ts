import { type Server } from 'socket.io'

let ioInstance: Server | null = null

export const initIO = (io: Server) => {
  ioInstance = io
}

export const getIO = (): Server => {
  if (!ioInstance) throw new Error('io not initialized')
  return ioInstance
}
