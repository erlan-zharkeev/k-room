import { isRoomPrivate, type ChatRoom } from 'global-shared'
import { computed } from 'vue'

import { db, dexieCollectionStore } from 'src/shared/lib'

const chatRoomStore = dexieCollectionStore<ChatRoom>(db['chat-rooms'])

export const useChatRoom = () => {
  const { bulkUpdate, mergeMany, mutate, put, remove, reset, update } = chatRoomStore
  const chatRooms = chatRoomStore.use()
  const hasChatRooms = computed(() => chatRooms.value.length > 0)
  const getById = (id: string) => chatRooms.value.find((room) => room.id === id)
  const getPersonalByContactId = (id: string) =>
    chatRooms.value.find((room) => isRoomPrivate(room) && room.users.includes(id))
  const isPrivate = (id: string) => isRoomPrivate(getById(id))
  const merge = (rooms: ChatRoom[]) =>
    mergeMany(rooms, {
      merge: (_current, incoming) => incoming,
      removeMissing: true
    })

  return {
    chatRooms,
    hasChatRooms,
    getById,
    getPersonalByContactId,
    isPrivate,
    put,
    update,
    bulkUpdate,
    mutate,
    merge,
    mergeMany,
    remove,
    reset
  }
}
