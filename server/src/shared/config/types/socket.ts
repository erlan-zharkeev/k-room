import { type Socket } from 'socket.io'
import { type DefaultEventsMap } from 'socket.io/dist/typed-events'

import { type AppLanguageType } from 'common-types'

export type SocketInstanceType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { userId: string, deviceId: string, language: AppLanguageType }
>
