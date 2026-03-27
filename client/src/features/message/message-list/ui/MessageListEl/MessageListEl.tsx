import './style.scss'

import { MessageBody, MessageMenu } from 'src/features/message'
import type { IMessageListElProps } from 'src/features/message/message-list/ui/MessageListEl/config'

import { createClassNameWithModifiers } from 'src/shared/utils'

export const MessageListEl = ({ message, isRoomPrivate }: IMessageListElProps) => {
  const className = createClassNameWithModifiers({
    rootClass: 'message-list-el',
    modifiers: [message.isSelf ? 'self' : 'interlocutor']
  })

  return (
    <div className={className}>
      <div className="message-list-el__body-with-settings">
        <MessageMenu message={message}>
          <div role="button" tabIndex={0}>
            <MessageBody message={message} isRoomPrivate={isRoomPrivate} />
          </div>
        </MessageMenu>
      </div>
    </div>
  )
}
