import { isRoomPrivate } from 'src/entities/chat-room/lib/is-room-private'

import { FChatRoomType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'
import { useSettings } from 'src/shared/preferences'

const chatRoomStore = dexieCollectionStore<FChatRoomType>(db['chat-rooms'])

export const useChatRoom = () => {
  const { put, update, mutate, mergeMany, reset } = chatRoomStore
  const { selectedChatRoomId } = useSettings()

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

  return {
    getById,
    getPersonalByContactId,
    chatRooms,
    hasChatRooms,
    selectedChatRoom,
    isSelectedRoomPrivate,
    put,
    update,
    mutate,
    mergeMany,
    reset
  }
}
