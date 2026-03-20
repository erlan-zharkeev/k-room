import { useLiveQuery } from 'dexie-react-hooks'

import { useMessage } from 'src/entities/message'
import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'

import { DbChatRoomType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useChatRoom = () => {
  const { selectedChatRoomId } = useSettings()
  const { repliedMessageData } = useSystem()
  const { messages } = useMessage()

  const chatRooms = useLiveQuery(async () => {
    return await (db['chat-rooms'].toArray() as Promise<DbChatRoomType[]>)
  }, []) ?? []

  const getRoomById = (id: string) => chatRooms.find((room) => room.id === id)

  const getPersonalRoomByContactId = (id: string) => {
    return chatRooms.find((room) => {
      return room.users.length === 1 && room.users[0] === id
    })
  }

  const selectedChatRoom = chatRooms.find((room) => room.id === selectedChatRoomId)
  const isSelectedRoomPrivate = Boolean(selectedChatRoom && selectedChatRoom.users.length > 0)
  const haveMessageToReply = Boolean(repliedMessageData?.id)

  const unreadMessageQuantity = messages.filter((message) => message.status === 'delivered' && !message.isSelf).length

  const putChatRoom = async (payload: DbChatRoomType) => await db['chat-rooms'].put(payload)

  const updateChatRoom = async (id: string, patch: Partial<DbChatRoomType>) => {
    await db['chat-rooms'].update(id, patch)
  }

  const reset = () => db['chat-rooms'].clear()

  return {
    getRoomById,
    getPersonalRoomByContactId,
    chatRooms,
    unreadMessageQuantity,
    selectedChatRoom,
    isSelectedRoomPrivate,
    repliedMessageData,
    haveMessageToReply,
    putChatRoom,
    updateChatRoom,
    reset
  }
}
