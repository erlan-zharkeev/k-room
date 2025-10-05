import { useState } from 'react'

import { SocketActionsType, IEventRoomCreated, IEventCreateRoom } from 'common-types'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { closeModal } from 'src/entities/system'

import { socket } from 'src/shared/api'
import { AppFormData } from 'src/shared/ui'

import { useChatRoomSelect } from '../../select-chat-room'

export const useCreateChatRoom = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { selectChatWithAsideById } = useChatRoomSelect()

  const dispatch = useDispatch<AppDispatch>()

  const createChatRoom = ({ formData }: { formData: AppFormData | IEventCreateRoom }) => {
    setIsLoading(true)
    const { avatarFile, chatName, contactIds } = formData as unknown as IEventCreateRoom
    socket.emit<SocketActionsType>('create-chat-room', { avatarFile, chatName, contactIds })
    socket.on<SocketActionsType>('room-created', roomCreationHandler)
  }

  const roomCreationHandler = ({ roomId }: IEventRoomCreated) => {
    selectChatWithAsideById(roomId)
    setIsLoading(false)
    dispatch(closeModal())
    socket.off('room-created', roomCreationHandler)
  }

  return {
    isLoading,
    createChatRoom
  }
}
