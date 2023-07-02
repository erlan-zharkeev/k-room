import { SocketActions } from '../../../types'
import { io } from '../server'
import { SocketInstanceType } from '../types/SocketInstanceType'
import { slices } from './slices'

io.on(SocketActions.CONNECTION, (socket: SocketInstanceType) => {
  Object.values(slices).forEach((slice) => slice(socket))
})
