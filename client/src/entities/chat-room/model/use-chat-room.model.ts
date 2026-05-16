import type { IChatRoom } from 'global-shared'
import { computed } from 'vue'

import type { FChatRoomType } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

import { isRoomPrivate } from '../lib/is-room-private'
import { transformRoomData } from '../lib/transform-room-data'

const chatRoomStore = dexieCollectionStore<FChatRoomType>(db['chat-rooms'])

export const useChatRoom = () => {
  const { mergeMany, mutate, put, remove, reset, update } = chatRoomStore
  const chatRooms = chatRoomStore.use()
  const hasChatRooms = computed(() => chatRooms.value.length > 0)
  const getById = (id: string) => chatRooms.value.find((room) => room.id === id)
  const getPersonalByContactId = (id: string) =>
    chatRooms.value.find((room) => isRoomPrivate(room) && room.users[0] === id)
  const isPrivate = (id: string) => isRoomPrivate(getById(id))
  const save = (room: IChatRoom) => put(transformRoomData(room))
  const merge = (rooms: IChatRoom[]) =>
    mergeMany(rooms, {
      merge: (_current, incoming) => transformRoomData(incoming)
    })

  return {
    chatRooms,
    hasChatRooms,
    getById,
    getPersonalByContactId,
    isPrivate,
    save,
    put,
    update,
    mutate,
    merge,
    mergeMany,
    remove,
    reset
  }
}
