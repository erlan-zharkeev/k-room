import type { IChatRoom } from 'global-shared'
import { computed } from 'vue'

import type { DbMessageType, FChatRoomType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

import { isRoomPrivate } from '../lib/is-room-private'
import { transformRoomData } from '../lib/transform-room-data'

const chatRoomStore = dexieCollectionStore<FChatRoomType>(db['chat-rooms'])
const messageStore = dexieCollectionStore<DbMessageType>(db.messages)

export const useChatRoom = () => {
  const { mergeMany, mutate, put, remove, reset, update } = chatRoomStore
  const chatRooms = chatRoomStore.use()
  const messages = messageStore.use()
  const hasChatRooms = computed(() => chatRooms.value.length > 0)
  const getById = (id: string) => chatRooms.value.find((room) => room.id === id)
  const getPersonalByContactId = (id: string) =>
    chatRooms.value.find(({ users }) => users.length === 1 && users[0] === id)
  const isPrivate = (id: string) => isRoomPrivate(getById(id))
  const save = (room: IChatRoom) => put(transformRoomData(room))
  const merge = (rooms: IChatRoom[]) =>
    mergeMany(rooms, {
      merge: (_current, incoming) => transformRoomData(incoming)
    })
  const allRoomMessageIds = computed(() => new Set(chatRooms.value.flatMap((room) => room.messages)))
  const unreadMessagesQuantity = computed(
    () => messages.value.filter(({ id, isSelf, status }) => allRoomMessageIds.value.has(id) && !isSelf && status === 'delivered').length
  )

  return {
    chatRooms,
    hasChatRooms,
    unreadMessagesQuantity,
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
