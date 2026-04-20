import './style.scss'

import { useMemo } from 'react'

import { Virtuoso } from 'react-virtuoso'

import { IMessage } from 'common'

import { useLoadRoomMessages } from 'src/features/load-room-messages'
import { MessageListLoader, NoMessagesPlaceholder } from 'src/features/message-list'
import {
  IMessageListProps,
  DateSeparator,
  getMessageGroupDateLabel,
  MessageListEl,
  MessageListItemType,
  useInitialScrollPosition,
  useMessageList,
  useMessageListScroll
} from 'src/features/message-list'

import { isRoomPrivate } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'

import { useSettings, useI18n } from 'src/shared/preferences'
import { AppScrollDownButton } from 'src/shared/ui'

export const MessageList = ({ room }: IMessageListProps) => {
  const isCurrentRoomPrivate = isRoomPrivate(room)

  const { getById } = useMessage()
  const { loadOlderMessages } = useLoadRoomMessages()
  const { isReady } = useSettings()
  const { language } = useI18n()
  const { virtuosoRef, isAtBottom, setIsAtBottom } = useMessageListScroll()

  const roomMessages = useMemo(
    () =>
      room.messages.map((messageId) => getById(messageId)).filter((message): message is IMessage => Boolean(message)),
    [getById, room.messages]
  )

  const virtualizedMessages = useMemo(() => {
    const nextItems: MessageListItemType[] = []
    let previousGroupDateLabel = ''

    roomMessages.forEach((message) => {
      const label = getMessageGroupDateLabel(message.createdAt, language)

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
  }, [language, roomMessages])

  const { initialTopMostItemIndex } = useInitialScrollPosition({ room, items: virtualizedMessages })
  const { handleVisibleRangeChange } = useMessageList({ roomId: room.id, items: virtualizedMessages })

  return (
    <div className="message-list">
      {!isReady ? (
        <MessageListLoader />
      ) : roomMessages.length <= 0 ? (
        <NoMessagesPlaceholder />
      ) : (
        <>
          <Virtuoso
            key={room.id}
            ref={virtuosoRef}
            data={virtualizedMessages}
            style={{ height: '100%' }}
            initialTopMostItemIndex={initialTopMostItemIndex}
            rangeChanged={handleVisibleRangeChange}
            startReached={() => loadOlderMessages(room.id)}
            atBottomStateChange={setIsAtBottom}
            computeItemKey={(_, item) => item.id}
            itemContent={(_, item) =>
              item.type === 'date-separator' ? (
                <DateSeparator label={item.label} />
              ) : (
                <MessageListEl message={item.message} isRoomPrivate={isCurrentRoomPrivate} />
              )
            }
          />
          <div className="message-list__scroll-down-button">
            <AppScrollDownButton hidden={isAtBottom} onClick={() => {}} />
          </div>
        </>
      )}
    </div>
  )
}
