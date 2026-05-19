import type { IMessage } from 'global-shared'

export interface ISendMessageParams {
  roomId: string
  message: IMessage
}
