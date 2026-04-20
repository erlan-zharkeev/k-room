import './style.scss'

import { MessageBody } from 'src/features/message-body'
import { IMessageListElProps } from 'src/features/message-list'
import { MessageMenu } from 'src/features/message-menu'

import { createClassNameWithModifiers } from 'src/shared/lib'

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
