import { IMessage } from 'common-types'

export interface IReactionsProps {
  userId: string
  selectedChatRoomId: string
  username: string
  message: IMessage
}
