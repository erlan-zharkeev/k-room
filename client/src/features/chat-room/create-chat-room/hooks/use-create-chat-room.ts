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
    socket.emit<SocketActionsType>('create-chat-room', formData as unknown as IEventCreateRoom)
    socket.on<SocketActionsType>('room-created', (eventData: IEventRoomCreated) => {
      roomCreationHandler({ roomCreationData: eventData })
    })
  }

  const createPersonalChat = () => {}

  const roomCreationHandler = ({ roomCreationData }: { roomCreationData: IEventRoomCreated }) => {
    selectChatWithAsideById(roomCreationData.roomId)
    setIsLoading(false)
    dispatch(closeModal())
    socket.off('room-created', roomCreationHandler)
  }

  const createChatRoomHandler = (contactId: string) => {
    const payload = {
      formData: { contactIds: [contactId] }
    }
    createChatRoom(payload)
  }

  // const getPersonalChatRoomId = (contact: ContactType) => {
  //   let result = null
  //   chatRooms.forEach((room) => {
  //     if (room.multiple) return
  //     const user = room.users.find((user) => user.id === contact.id)
  //     if (user) result = room.id
  //   })
  //   return result
  // }

  // const clickChatBtnHandler = (contact: ContactType) => {
  //   if (loaders.room[contact.id]) return
  //   const personalChatRoomId = getPersonalChatRoomId(contact)
  //   if (personalChatRoomId) {
  //     selectChatWithAsideById(personalChatRoomId)
  //     return
  //   }
  //   createChatRoomHandler(contact.id)
  // }

  return {
    isLoading,
    createChatRoom
  }
}
