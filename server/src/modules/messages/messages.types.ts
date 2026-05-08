import type { AppLanguageType, IMessage } from 'global-shared'

export interface ISendMessageParams {
  roomId: string
  message: IMessage
  language: AppLanguageType
}
