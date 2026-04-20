import './style.scss'
import {
  IMessageBodyProps,
  MessageImages,
  MessageReactions,
  MessageTime,
  RepliedMessage
} from 'src/features/message-body'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

export const MessageBody = ({ message, isRoomPrivate = false }: IMessageBodyProps & { isRoomPrivate?: boolean }) => {
  const showAuthorName = !isRoomPrivate && !message.isSelf

  const className = createClassNameWithModifiers({ rootClass: 'message-body', modifiers: [message.status] })

  return (
    <div className={className} message-id={message.id}>
      {showAuthorName && (
        <AppText color="accent-color" additionalClassName="message-body__author">
          {message.authorName}
        </AppText>
      )}
      <RepliedMessage message={message} />
      <MessageImages message={message} />
      <AppText>{message.body}</AppText>
      <div className="message-body__additional-info">
        {message.isSelf && <div className="message-body__status" />}
        <MessageReactions message={message} />
        <MessageTime createdAt={message.createdAt} />
      </div>
    </div>
  )
}
