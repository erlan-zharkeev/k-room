import { IMessage } from 'common-types'

import { useAddMessageToChatRoom } from 'src/features/chat-room'

import { useMessage } from 'src/entities/message'

export const useAddMessage = () => {
  const { putMessage } = useMessage()
  const { addMessageToChatRoom } = useAddMessageToChatRoom()

  const addMessage = (chatRoomId: string, messageData: IMessage) => {
    putMessage(messageData)
    addMessageToChatRoom(chatRoomId, messageData.id)
  }

  return { addMessage }
}
