import './style.scss'

import { useMemo } from 'react'

import { IChatRoom, IMessage } from 'common-types'
import { Virtuoso } from 'react-virtuoso'

import { NoMessagesPlaceholder, useLoadRoomMessages, ROOM_MESSAGES_PAGE_LIMIT } from 'src/features/message'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useSettings } from 'src/entities/settings'

import { MessageListItemType } from '../../config'
import { useMessageList } from '../../hooks/use-message-list'
import { getMessageGroupDateLabel } from '../../lib'
import { DateSeparator } from '../DateSeparator/DateSeparator'
import { MessageListEl } from '../MessageListEl/MessageListEl'

export const MessageList = ({ selectedChatRoom }: { selectedChatRoom: IChatRoom }) => {
  const { isSelectedRoomPrivate } = useChatRoom()
  const { getMessageById } = useMessage()
  const { loadRoomMessages, getHasMoreMessages, getNextBeforeCreatedAt } = useLoadRoomMessages()
  const { messageScrollByRoom } = useSettings()
  const messages = useMemo(
    () =>
      selectedChatRoom.messages
        .map((messageId) => getMessageById(messageId))
        .filter((message): message is IMessage => Boolean(message)),
    [getMessageById, selectedChatRoom.messages]
  )
  const items = useMemo(() => {
    const nextItems: MessageListItemType[] = []
    let previousGroupDateLabel = ''

    messages.forEach((message) => {
      const label = getMessageGroupDateLabel(message.createdAt)

      if (previousGroupDateLabel !== label) {
        nextItems.push({
          type: 'date-separator',
          id: `date-separator-${message.id}`,
          label
        })
        previousGroupDateLabel = label
      }

      nextItems.push({
        type: 'message',
        id: message.id,
        message
      })
    })

    return nextItems
  }, [messages])

  const initialFirstVisibleItemId = messageScrollByRoom[selectedChatRoom.id]?.firstVisibleItemId
  const { handleVisibleRangeChange } = useMessageList({ roomId: selectedChatRoom.id, items })
  const initialTopMostItemIndex = useMemo(() => {
    if (!initialFirstVisibleItemId) return undefined

    const itemIndex = items.findIndex((item) => {
      return item.type === 'message' && item.message.id === initialFirstVisibleItemId
    })

    return itemIndex >= 0 ? itemIndex : undefined
  }, [initialFirstVisibleItemId, items])

  const handleLoadOlderMessages = () => {
    const roomId = selectedChatRoom.id
    const beforeCreatedAt = getNextBeforeCreatedAt(roomId)

    if (!beforeCreatedAt || !getHasMoreMessages(roomId)) return

    loadRoomMessages({
      roomId,
      limit: ROOM_MESSAGES_PAGE_LIMIT,
      beforeCreatedAt
    })
  }

  if (messages.length <= 0) {
    return (
      <div className="message-list">
        <NoMessagesPlaceholder messages={messages.map(({ id }) => id)} />
      </div>
    )
  }

  return (
    <Virtuoso
      key={selectedChatRoom.id}
      className="message-list"
      data={items}
      style={{ height: '100%' }}
      initialTopMostItemIndex={initialTopMostItemIndex}
      rangeChanged={handleVisibleRangeChange}
      startReached={handleLoadOlderMessages}
      computeItemKey={(_, item) => item.id}
      itemContent={(_, item) =>
        item.type === 'date-separator' ? (
          <DateSeparator label={item.label} />
        ) : (
          <MessageListEl message={item.message} isSelectedRoomPrivate={isSelectedRoomPrivate} />
        )
      }
    />
  )
}
