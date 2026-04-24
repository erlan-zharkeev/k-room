import { useMemo } from 'react'

import { IChatRoom } from 'common'

import { ROOM_MESSAGES_PAGE_LIMIT } from 'src/shared/config'
import { useSettings } from 'src/shared/preferences'

import { MessageListItemType } from './message-list.types.ts'

export const useInitialScrollPosition = ({ room, items }: { room: IChatRoom; items: MessageListItemType[] }) => {
  const { messageScrollByRoom } = useSettings()

  const initialFirstVisibleItemId = messageScrollByRoom[room.id]?.firstVisibleItemId
  const initialTopMostItemIndex = useMemo(() => {
    if (!initialFirstVisibleItemId) return ROOM_MESSAGES_PAGE_LIMIT
    const itemIndex = items.findIndex((item) => {
      return item.type === 'message' && item.message.id === initialFirstVisibleItemId
    })
    return itemIndex >= 0 ? itemIndex : ROOM_MESSAGES_PAGE_LIMIT
  }, [initialFirstVisibleItemId, items])

  return { initialTopMostItemIndex }
}
