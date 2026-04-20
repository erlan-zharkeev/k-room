import { useState } from 'react'

import { SocketActionsType, IEventRoomCreated, IEventCreateRoom } from 'common'

import { useChatRoomSelect } from 'src/features/select-chat-room'

import { socket } from 'src/shared/api'
import { AppFormDataType } from 'src/shared/ui'

export const useCreateChatRoom = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { selectChatWithAsideById } = useChatRoomSelect()

  const createChatRoom = ({ formData }: { formData: AppFormDataType | IEventCreateRoom }) => {
    setIsLoading(true)
    const { avatarFile, chatName, contactIds } = formData as unknown as IEventCreateRoom
    socket.emit<SocketActionsType>('create-chat-room', { avatarFile, chatName, contactIds })
    socket.on<SocketActionsType>('room-created', roomCreationHandler)
  }

  const roomCreationHandler = ({ roomId }: IEventRoomCreated) => {
    selectChatWithAsideById(roomId)
    setIsLoading(false)
    onSuccess?.()
    socket.off('room-created', roomCreationHandler)
  }

  return {
    isLoading,
    createChatRoom
  }
}
