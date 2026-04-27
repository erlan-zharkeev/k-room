import type { DbMessageType } from 'src/shared/config'

export interface IMessageListProps {
  roomId: string
  messages: DbMessageType[]
  hasMoreMessages: boolean
  isLoading: boolean
  formatRelativeTime: (timestampMs?: number) => string
}
