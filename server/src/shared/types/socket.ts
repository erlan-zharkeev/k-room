import type { AppLanguageType } from 'global-shared'
import type { DefaultEventsMap, Socket } from 'socket.io'

export type SocketInstanceType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { userId: string; deviceId: string; language: AppLanguageType }
>
