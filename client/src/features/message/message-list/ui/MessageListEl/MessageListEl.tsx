import './style.scss'

import { RefObject } from 'react'

import { isAutoMessage } from 'src/features/message/lib'
import { MessageBody } from 'src/features/message/message-body'
import { MessageMenu } from 'src/features/message/message-menu'

import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'

import { locationModifier } from '../../lib'

export const MessageListEl = ({ id, setRef }: { id: string; setRef?: (id: string) => RefObject<HTMLDivElement> }) => {
  const { getMessageById } = useMessage()
  const message = getMessageById(id)
  const { id: userId } = useUser()
  if (!message || !userId) return null

  return (
    <div
      key={message.id}
      className={`message-list-el message-list-el--${locationModifier(message.authorId, userId)}`}
      ref={setRef?.(message.id)}
    >
      <div className="message-list-el__body-with-settings">
        {isAutoMessage(message) ? (
          <MessageBody message={message} />
        ) : (
          <MessageMenu userId={id} message={message}>
            <div role="button" tabIndex={0}>
              <MessageBody message={message} />
            </div>
          </MessageMenu>
        )}
      </div>
    </div>
  )
}
