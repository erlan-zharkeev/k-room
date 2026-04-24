import { AppLanguageType } from 'common'
import { DefaultEventsMap, Socket } from 'socket.io'

export type SocketInstanceType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { userId: string; deviceId: string; language: AppLanguageType }
>
