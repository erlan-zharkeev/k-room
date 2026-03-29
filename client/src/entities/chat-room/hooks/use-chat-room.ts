import { useLiveQuery } from 'dexie-react-hooks'

import { useMessage } from 'src/entities/message'
import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'

import { FChatRoomType } from 'src/shared/config'
import { db } from 'src/shared/lib'

import { isRoomPrivate } from '..'

export const useChatRoom = () => {
  const { selectedChatRoomId } = useSettings()
  const { repliedMessageData } = useSystem()
  const { messages } = useMessage()

  const chatRooms = useLiveQuery(async () => {
    return await (db['chat-rooms'].toArray() as Promise<FChatRoomType[]>)
  }, []) ?? []

  const getRoomById = (id: string) => chatRooms.find((room) => room.id === id)

  const getPersonalRoomByContactId = (id: string) => {
    return chatRooms.find((room) => {
      return room.users.length === 1 && room.users[0] === id
    })
  }

  const selectedChatRoom = chatRooms.find((room) => room.id === selectedChatRoomId)
  const isSelectedRoomPrivate = isRoomPrivate(selectedChatRoom)
  const haveMessageToReply = Boolean(repliedMessageData?.id)
  const hasChatRooms = chatRooms.length > 0

  const unreadMessageQuantity = messages.filter((message) => message.status === 'delivered' && !message.isSelf).length

  const putChatRoom = async (payload: FChatRoomType) => await db['chat-rooms'].put(payload)

  const updateChatRoom = async (id: string, patch: Partial<FChatRoomType>) => {
    await db['chat-rooms'].update(id, patch)
  }

  const reset = () => db['chat-rooms'].clear()

  return {
    getRoomById,
    getPersonalRoomByContactId,
    chatRooms,
    hasChatRooms,
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
