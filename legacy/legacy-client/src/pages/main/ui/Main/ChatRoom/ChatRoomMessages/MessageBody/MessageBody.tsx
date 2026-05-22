import './message-body.scss'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

import { MessageBodyProps } from './message-body.types.ts'
import { MessageImages } from '../MessageImages/MessageImages'
import { MessageReactions } from '../MessageReactions/MessageReactions'
import { MessageTime } from '../MessageTime'
import { RepliedMessage } from '../RepliedMessage/RepliedMessage'

export const MessageBody = ({ message, isRoomPrivate = false }: MessageBodyProps & { isRoomPrivate?: boolean }) => {
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
