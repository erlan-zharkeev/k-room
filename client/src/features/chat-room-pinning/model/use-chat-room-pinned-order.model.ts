import { useChatRoom } from 'src/entities/chat-room'

export const useChatRoomPinnedOrder = () => {
  const { bulkUpdate, chatRooms } = useChatRoom()

  const updatePinnedOrder = (pinnedChatRoomIds: string[]) => {
    const pinnedOrderByRoomId = new Map(pinnedChatRoomIds.map((roomId, pinnedOrder) => [roomId, pinnedOrder]))

    return bulkUpdate(
      chatRooms.value.map(({ id }) => {
        const pinnedOrder = pinnedOrderByRoomId.get(id) ?? null

        return {
          id,
          changes: {
            isPinned: pinnedOrder !== null,
            pinnedOrder
          }
        }
      })
    )
  }

  return {
    updatePinnedOrder
  }
}
