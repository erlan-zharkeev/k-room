import type { Message } from 'global-shared'

export interface SendMessageParams {
  roomId: string
  message: Message
}
