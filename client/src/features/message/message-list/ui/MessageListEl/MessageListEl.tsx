import './style.scss'

import { createClassNameWithModifiers } from 'src/shared/utils'

import type { IMessageListElProps } from '../../..'
import { MessageBody, MessageMenu } from '../../..'

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
