import { type DefaultEventsMap, type Socket } from 'socket.io'

import { type AppLanguageType } from 'common'

export type SocketInstanceType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { userId: string; deviceId: string; language: AppLanguageType }
>
