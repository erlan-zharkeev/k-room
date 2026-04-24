import './style.scss'

import { ReactNode, useMemo } from 'react'

import { Virtuoso } from 'react-virtuoso'

import { IEventAddReaction, IMessage, SocketActionsType } from 'common'

import { isRoomPrivate } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'
import { EMOJI_LIST, FChatRoomType } from 'src/shared/config'
import { createClassNameWithModifiers, stopPropagation } from 'src/shared/lib'
import { useI18n, useSettings } from 'src/shared/preferences'
import { AppDropdown, AppModal, AppScrollDownButton, AppText } from 'src/shared/ui'

import { useLoadRoomMessages } from '../../../../model/use-load-room-messages'
import { useMessage } from '../../../../model/use-message'
import { useReplyMessage } from '../ChatRoom/use-reply-message'

import { DateSeparator } from './DateSeparator/DateSeparator'
import { ForwardMessageModal } from './ForwardMessageModal/ForwardMessageModal'
import { getMessageGroupDateLabel } from './get-message-group-date-label'
import { CHAT_ROOM_MESSAGES_I18N } from './i18n.ts'
import { MessageListItemType } from './message-list.types.ts'
import { MessageBody } from './MessageBody/MessageBody'
import { MessageListLoader } from './MessageListLoader'
import { NoMessagesPlaceholder } from './NoMessagesPlaceholder/NoMessagesPlaceholder'
import { useInitialScrollPosition } from './use-initial-scroll-position'
import { useMessageDelete } from './use-message-delete'
import { useMessageForward } from './use-message-forward'
import { useMessageList } from './use-message-list'
import { useMessageListScroll } from './use-message-list-scroll'

const MessageMenuReactions = ({
  userId,
  selectedChatRoomId,
  username,
  message
}: {
  userId: string
  selectedChatRoomId: string
  username: string
  message: IMessage
}) => {
  const reactions = EMOJI_LIST.filter((emoji) => emoji.reactions)

  const selfReactions = useMemo(
    () =>
      message.reactions?.filter((reaction) => reaction.authorId === userId).map((reaction) => reaction.glyphKey) ?? [],
    [message.reactions, userId]
  )

  const isDisabled = (glyphKey: string) => (selfReactions.includes(glyphKey) ? 'disabled' : 'default')

  const addReactionToMessage = (key: string) => {
    const payload: IEventAddReaction = {
      glyphKey: key,
      messageId: message.id,
      roomId: selectedChatRoomId,
      username
    }

    socket.emit<SocketActionsType>('add-reaction', payload)
  }

  return (
    <div className="message-menu-reactions">
      {reactions.map((reaction) => (
        <button
          type="button"
          className={createClassNameWithModifiers({
            rootClass: 'message-menu-reactions__element',
            modifiers: [isDisabled(reaction.key)]
          })}
          key={reaction.key}
          onClick={() => addReactionToMessage(reaction.key)}
        >
          {reaction.glyph}
        </button>
      ))}
    </div>
  )
}

const MessageActionsMenu = ({ message, children }: { message: IMessage; children: ReactNode }) => {
  const { deleteMessageHandler } = useMessageDelete()
  const { isOpen, forwardMessageHandler, closeForwardMessageModal } = useMessageForward()
  const { replyMessageHandler } = useReplyMessage()
  const { username, id: userId } = useUser()
  const { selectedChatRoomId } = useSettings()
  const { t } = useI18n()

  const items = [
    {
      name: 'reactions',
      label: (
        <MessageMenuReactions
          userId={userId ?? ''}
          username={username}
          selectedChatRoomId={selectedChatRoomId}
          message={message}
        />
      )
    },
    {
      name: 'reply',
      label: <AppText additionalClassName="message-menu__el-text">{t(CHAT_ROOM_MESSAGES_I18N.reply)}</AppText>,
      handler: (evt: unknown) => {
        stopPropagation(evt)
        replyMessageHandler(message)
      }
    },
    {
      name: 'forward',
      label: <AppText additionalClassName="message-menu__el-text">{t(CHAT_ROOM_MESSAGES_I18N.forward)}</AppText>,
      handler: (evt: unknown) => {
        stopPropagation(evt)
        forwardMessageHandler()
      }
    },
    {
      name: 'delete',
      label: <AppText additionalClassName="message-menu__el-text">{t(CHAT_ROOM_MESSAGES_I18N.delete)}</AppText>,
      handler: (evt: unknown) => {
        stopPropagation(evt)
        deleteMessageHandler(selectedChatRoomId, message.id)
      }
    }
  ]

  return (
    <>
      <AppDropdown
        overlayStyle={{ width: '200px', minWidth: '200px' }}
        additionalClassName="message-menu"
        items={items.map((item, idx) => ({
          type: 'item',
          onClick: item.handler,
          label: item.label,
          key: idx
        }))}
      >
        {children}
      </AppDropdown>
      <AppModal title={t(CHAT_ROOM_MESSAGES_I18N.forwardModalTitle)} open={isOpen} onClose={closeForwardMessageModal}>
        <ForwardMessageModal onClose={closeForwardMessageModal} />
      </AppModal>
    </>
  )
}

const MessageListItem = ({ message, isPrivate }: { message: IMessage; isPrivate: boolean }) => {
  const className = createClassNameWithModifiers({
    rootClass: 'message-list-el',
    modifiers: [message.isSelf ? 'self' : 'interlocutor']
  })

  return (
    <div className={className}>
      <div className="message-list-el__body-with-settings">
        <MessageActionsMenu message={message}>
          <div role="button" tabIndex={0}>
            <MessageBody message={message} isRoomPrivate={isPrivate} />
          </div>
        </MessageActionsMenu>
      </div>
    </div>
  )
}

export const ChatRoomMessages = ({ room }: { room: FChatRoomType }) => {
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
                <MessageListItem message={item.message} isPrivate={isCurrentRoomPrivate} />
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
