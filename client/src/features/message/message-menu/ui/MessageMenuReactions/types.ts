import { IMessage } from 'common'

export interface IReactionsProps {
  userId: string
  selectedChatRoomId: string
  username: string
  message: IMessage
}
