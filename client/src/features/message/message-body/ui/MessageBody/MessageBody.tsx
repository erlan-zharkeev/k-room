import './style.scss'
import type { IMessageBodyProps } from 'src/features/message/message-body/ui/MessageBody/types'
import { MessageImages } from 'src/features/message/message-body/ui/MessageImages/MessageImages'
import { MessageReactions } from 'src/features/message/message-body/ui/MessageReactions/MessageReactions'
import { MessageTime } from 'src/features/message/message-body/ui/MessageTime/MessageTime'
import { RepliedMessage } from 'src/features/message/message-body/ui/RepliedMessage/RepliedMessage'

import { AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

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
