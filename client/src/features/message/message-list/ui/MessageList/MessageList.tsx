import './style.scss'
import { IChatRoom } from 'common-types'

import { isAutoMessage, MessageBody, NoMessagesPlaceholder } from 'src/features/message'
import { MessageMenu } from 'src/features/message/message-menu/ui'

import { useUser } from 'src/entities/user'

import { AppScrollContainer } from 'src/shared/ui'

import { useMessageList } from '../../hooks'
import { locationModifier } from '../../lib'

export const MessageList = ({
  selectedChatRoom,
  isSelectedRoomPrivate
}: {
  selectedChatRoom: IChatRoom
  isSelectedRoomPrivate: boolean
}) => {
  const { messages, setRef } = useMessageList(selectedChatRoom)
  const { id, username } = useUser()

  return (
    <AppScrollContainer additionalClassName="message-list" height="100%" id={selectedChatRoom.id}>
      <NoMessagesPlaceholder messages={selectedChatRoom.messages} />
      {messages.map((message) =>
        message.id ? (
          <div
            key={message.id}
            className={`message-list__message-body-wrapper message-list__message-body-wrapper--${locationModifier(
              message.authorId,
              id
            )}`}
            ref={setRef(message.id)}
          >
            <div className="message-list__body-with-settings">
              {isAutoMessage(message) ? (
                <MessageBody message={message} isPrivate={isSelectedRoomPrivate} />
              ) : (
                <MessageMenu userId={id} username={username} message={message} selectedChatRoomId={selectedChatRoom.id}>
                  <div role="button" tabIndex={0}>
                    <MessageBody message={message} isPrivate={isSelectedRoomPrivate} />
                  </div>
                </MessageMenu>
              )}
            </div>
          </div>
        ) : null
      )}
    </AppScrollContainer>
  )
}
