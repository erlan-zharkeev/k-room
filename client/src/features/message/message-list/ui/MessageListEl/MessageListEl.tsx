import './style.scss'
import type { IMessage } from 'common-types'

import { MessageBody, MessageMenu } from 'src/features/message'

import { createClassNameWithModifiers } from 'src/shared/utils'

export const MessageListEl = ({ message, isRoomPrivate }: { message: IMessage; isRoomPrivate: boolean }) => {
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
