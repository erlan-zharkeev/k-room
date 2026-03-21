import './style.scss'
import { IMessage } from 'common-types'

import { MessageBody } from 'src/features/message/message-body'
import { MessageMenu } from 'src/features/message/message-menu'

export const MessageListEl = ({
  message,
  isSelectedRoomPrivate
}: {
  message: IMessage
  isSelectedRoomPrivate: boolean
}) => {
  return (
    <div className={`message-list-el message-list-el--${message.isSelf ? 'self' : 'interlocutor'}`}>
      <div className="message-list-el__body-with-settings">
        <MessageMenu message={message}>
          <div role="button" tabIndex={0}>
            <MessageBody message={message} isSelectedRoomPrivate={isSelectedRoomPrivate} />
          </div>
        </MessageMenu>
      </div>
    </div>
  )
}
