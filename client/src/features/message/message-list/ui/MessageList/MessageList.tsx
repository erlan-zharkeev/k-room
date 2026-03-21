import './style.scss'

import { IChatRoom, IMessage } from 'common-types'
import moment from 'moment'
import { Virtuoso } from 'react-virtuoso'

import { NoMessagesPlaceholder, useLoadRoomMessages, ROOM_MESSAGES_PAGE_LIMIT } from 'src/features/message'

import { useMessage } from 'src/entities/message'

import { MessageListItemType } from '../../config'
import { useMessageList } from '../../hooks/use-message-list'
import { DateSeparator } from '../DateSeparator/DateSeparator'
import { MessageListEl } from '../MessageListEl/MessageListEl'

export const MessageList = ({ selectedChatRoom }: { selectedChatRoom: IChatRoom }) => {
  const { getMessageById } = useMessage()
  const { loadRoomMessages, getHasMoreMessages, getNextBeforeCreatedAt } = useLoadRoomMessages()
  const messages = selectedChatRoom.messages
    .map((messageId) => getMessageById(messageId))
    .filter((message): message is IMessage => Boolean(message))
  const items: MessageListItemType[] = []

  messages.forEach((message) => {
    const label = moment(Number(message.createdAt)).format('LL')
    const prevItem = items.at(-1)

    if (prevItem?.type !== 'date-separator' || prevItem.label !== label) {
      items.push({
        type: 'date-separator',
        id: `date-separator-${message.id}`,
        label
      })
    }

    items.push({
      type: 'message',
      id: message.id,
      message
    })
  })

  const { handleVisibleRangeChange } = useMessageList({ roomId: selectedChatRoom.id, items })

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
      className="message-list"
      data={items}
      style={{ height: '100%' }}
      rangeChanged={handleVisibleRangeChange}
      startReached={handleLoadOlderMessages}
      computeItemKey={(_, item) => item.id}
      itemContent={(_, item) =>
        item.type === 'date-separator' ? <DateSeparator label={item.label} /> : <MessageListEl message={item.message} />
      }
    />
  )
}
