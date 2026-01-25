import { useLiveQuery } from 'dexie-react-hooks'

import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'

import { DbChatRoomType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useChatRoom = () => {
  const { selectedChatRoomId } = useSettings()
  const { repliedMessageData } = useSystem()

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

  // const unreadMessageQuantity = chatRooms.reduce(
  //   (total, room) =>
  //     total + room.messages.filter((m) => m.status === 'delivered' && !m.isSelf).length,
  //   0
  // )

  return {
    getRoomById,
    getPersonalRoomByContactId,
    chatRooms,
    unreadMessageQuantity: 0, // TODO
    selectedChatRoom,
    isSelectedRoomPrivate,
    repliedMessageData,
    haveMessageToReply,
    putChatRoom: async (payload: DbChatRoomType) => await db['chat-rooms'].put(payload),
    updateChatRoom: async (id: string, patch: Partial<DbChatRoomType>) => {
      await db['chat-rooms'].update(id, patch)
    },
    reset: () => db['chat-rooms'].clear()
  }
}
