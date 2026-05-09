import type { IEventAddReaction } from 'global-shared'

import type { DbMessageType } from 'src/shared/lib'

export interface IMessageListProps {
  roomId: string
  messages: DbMessageType[]
  hasMoreMessages: boolean
  isLoading: boolean
  formatRelativeTime: (timestampMs?: number) => string
}

export interface IMessageListEmits {
  loadMore: []
  reply: [message: DbMessageType]
  forward: [message: DbMessageType]
  delete: [message: DbMessageType]
  addReaction: [payload: IEventAddReaction]
}
