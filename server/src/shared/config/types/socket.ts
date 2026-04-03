import { DefaultEventsMap, Socket } from 'socket.io'

import { AppLanguageType } from 'common'

export type SocketInstanceType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { userId: string; deviceId: string; language: AppLanguageType }
>
