import { IMessage } from 'common'

import { useAddMessageToChatRoom } from 'src/features/add-message-to-chat-room'

import { useMessage } from 'src/entities/message'

export const useAddMessage = () => {
  const { put } = useMessage()
  const { addMessageToChatRoom } = useAddMessageToChatRoom()

  const addMessage = (chatRoomId: string, messageData: IMessage) => {
    void put(messageData)
    addMessageToChatRoom(chatRoomId, messageData.id)
  }

  return { addMessage }
}
