import './style.scss'
import { IChatRoom } from 'common-types'

import { MessageBody, NoMessagesPlaceholder } from 'src/features/message'

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
  const { id } = useUser()

  return (
    <AppScrollContainer id="message-list" additionalClassName="message-list" height="100%">
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
            <MessageBody message={message} isPrivate={isSelectedRoomPrivate} />
          </div>
        ) : null
      )}
    </AppScrollContainer>
  )
}
