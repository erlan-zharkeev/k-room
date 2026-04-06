import { isRoomPrivate } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'

import { FChatRoomType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'
import { useSettings } from 'src/shared/settings'

const chatRoomStore = dexieCollectionStore<FChatRoomType>(db['chat-rooms'])

export const useChatRoom = () => {
  const { put, update, mutate, mergeMany, reset } = chatRoomStore
  const { selectedChatRoomId } = useSettings()
  const { messages } = useMessage()

  const chatRooms = chatRoomStore.use()

  const getById = (id: string) => chatRooms.find((room) => room.id === id)

  const getPersonalByContactId = (id: string) => {
    return chatRooms.find((room) => {
      return room.users.length === 1 && room.users[0] === id
    })
  }

  const selectedChatRoom = chatRooms.find((room) => room.id === selectedChatRoomId)
  const isSelectedRoomPrivate = isRoomPrivate(selectedChatRoom)
  const hasChatRooms = chatRooms.length > 0
  const unreadMessageQuantity = messages.filter((message) => message.status === 'delivered' && !message.isSelf).length

  return {
    getById,
    getPersonalByContactId,
    chatRooms,
    hasChatRooms,
    unreadMessageQuantity,
    selectedChatRoom,
    isSelectedRoomPrivate,
    put,
    update,
    mutate,
    mergeMany,
    reset
  }
}
