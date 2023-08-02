import { SocketActions } from '../../../types'
import { io } from '../server'
import { SocketInstanceType } from '../types/SocketInstanceType'
import { slices } from './slices'

try {
  io.on(SocketActions.CONNECTION, (socket: SocketInstanceType) => {
    Object.values(slices).forEach((slice) => slice(socket))
  })
} catch (e) {
  console.log(e)
}
