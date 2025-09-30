import { type Socket } from 'socket.io'
import { type DefaultEventsMap } from 'socket.io/dist/typed-events'

export type SocketInstanceType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, { userId: string, deviceId: string }>
