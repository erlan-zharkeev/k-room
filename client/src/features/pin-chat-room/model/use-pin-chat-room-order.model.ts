import { useChatRoom } from 'src/entities/chat-room'

export const usePinChatRoomOrder = () => {
  const { bulkUpdate, chatRooms } = useChatRoom()

  const updatePinnedChatRoomOrder = (pinnedChatRoomIds: string[]) => {
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
    updatePinnedChatRoomOrder
  }
}
