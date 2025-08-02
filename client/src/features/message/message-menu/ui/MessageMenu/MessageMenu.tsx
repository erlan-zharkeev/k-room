import './style.scss'

import { IMessage } from 'common-types'

import { useMessageDelete, useMessageForward } from 'src/features/message'
import { useReplyMessage } from 'src/features/message/reply-message/hooks'

import { AppDropdown, AppText } from 'src/shared/ui'
import { stopPropagation } from 'src/shared/utils'

import { MessageReactions } from './../'

export const MessageMenu = ({
  userId,
  username,
  selectedChatRoomId,
  message,
  children
}: {
  userId: string
  username: string
  selectedChatRoomId: string
  message: IMessage
  children: React.ReactNode
}) => {
  const { deleteMessageHandler } = useMessageDelete()
  const { forwardMessageHandler } = useMessageForward()
  const { replyMessageHandler } = useReplyMessage()

  const items = [
    {
      name: 'reactions',
      label: (
        <MessageReactions
          userId={userId}
          username={username}
          selectedChatRoomId={selectedChatRoomId}
          message={message}
        />
      )
    },
    {
      name: 'reply',
      label: <AppText additionalClassName="message-menu__el-text">Reply</AppText>,
      handler: (evt: unknown) => {
        stopPropagation(evt)
        replyMessageHandler(message)
      }
    },
    {
      name: 'forward',
      label: <AppText additionalClassName="message-menu__el-text">Forward</AppText>,
      handler: (evt: unknown) => {
        stopPropagation(evt)
        forwardMessageHandler()
      }
    },
    {
      name: 'delete',
      label: <AppText additionalClassName="message-menu__el-text">Delete</AppText>,
      handler: (evt: unknown) => {
        stopPropagation(evt)
        deleteMessageHandler(selectedChatRoomId, message.id)
      }
    }
  ]

  return (
    <AppDropdown
      overlayStyle={{ width: '200px', minWidth: '200px' }}
      additionalClassName="message-menu"
      items={items.map((item, idx) => ({
        type: 'item',
        onClick: item.handler,
        label: item.label,
        key: idx
      }))}
    >
      {children}
    </AppDropdown>
  )
}
