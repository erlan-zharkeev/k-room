import type { MessageType } from 'global-shared'

export interface ISendMessageParams {
  roomId: string
  message: MessageType
}
