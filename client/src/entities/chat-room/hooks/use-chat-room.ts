import { isRoomPrivate } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'

import { FChatRoomType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const chatRoomStore = dexieCollectionStore<FChatRoomType>(db['chat-rooms'])

export const useChatRoom = () => {
  const { selectedChatRoomId } = useSettings()
  const { repliedMessageData } = useSystem()
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
  const haveMessageToReply = Boolean(repliedMessageData?.id)
  const hasChatRooms = chatRooms.length > 0

  const unreadMessageQuantity = messages.filter((message) => message.status === 'delivered' && !message.isSelf).length

  const replaceAll = async (rooms: FChatRoomType[]) => {
    await chatRoomStore.replaceAll(rooms)
  }

  const addMessage = async (roomId: string, messageId: string) => {
    await chatRoomStore.mutate(roomId, (room) => {
      room.messages = Array.isArray(room.messages) ? room.messages : []
      if (room.messages[room.messages.length - 1] !== messageId) {
        room.messages.push(messageId)
      }
    })
  }

  return {
    getById,
    getPersonalByContactId,
    chatRooms,
    hasChatRooms,
    unreadMessageQuantity,
    selectedChatRoom,
    isSelectedRoomPrivate,
    repliedMessageData,
    haveMessageToReply,
    put: (payload: FChatRoomType) => chatRoomStore.put(payload),
    update: (id: string, patch: Partial<FChatRoomType>) => chatRoomStore.update(id, patch),
    replaceAll,
    addMessage,
    reset: () => chatRoomStore.reset()
  }
}
