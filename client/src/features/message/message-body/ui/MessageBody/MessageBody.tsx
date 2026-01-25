import './style.scss'

import { isAutoMessage } from 'src/features/message/lib'

import { useChatRoom } from 'src/entities/chat-room'

import { AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import { MessageImages } from '../MessageImages/MessageImages'
import { MessageReactions } from '../MessageReactions/MessageReactions'
import { MessageTime } from '../MessageTime/MessageTime'
import { RepliedMessage } from '../RepliedMessage/RepliedMessage'

import type { IMessageBodyProps } from './types'

export const MessageBody = ({ message }: IMessageBodyProps) => {
  const { isSelectedRoomPrivate } = useChatRoom()
  const showAuthorName = !isSelectedRoomPrivate && !message.isSelf && !isAutoMessage(message)

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
