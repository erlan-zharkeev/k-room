import './style.scss'

import { IMessageListElProps, MessageBody, MessageMenu } from 'src/features/message'

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
