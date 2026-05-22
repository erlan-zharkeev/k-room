import { AppLanguage } from 'common'
import { DefaultEventsMap, Socket } from 'socket.io'

export type SocketInstance = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { userId: string; deviceId: string; language: AppLanguage }
>
