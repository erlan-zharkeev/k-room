import './style.scss'

import { IMessage } from 'common'

import {
  ForwardMessageModal,
  MessageReactions,
  useMessageDelete,
  useMessageForward,
  useReplyMessage
} from 'src/features/message'

import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'
import { useUser } from 'src/entities/user'

import { AppDropdown, AppModal, AppText } from 'src/shared/ui'
import { stopPropagation } from 'src/shared/utils'

import { MESSAGE_MENU_I18N } from './config'

export const MessageMenu = ({ message, children }: { message: IMessage; children: React.ReactNode }) => {
  const { deleteMessageHandler } = useMessageDelete()
  const { isOpen, forwardMessageHandler, closeForwardMessageModal } = useMessageForward()
  const { replyMessageHandler } = useReplyMessage()
  const { username, id: userId } = useUser()
  const { selectedChatRoomId } = useSettings()
  const { t } = useI18n()

  const items = [
    {
      name: 'reactions',
      label: (
        <MessageReactions
          userId={userId ?? ''}
          username={username}
          selectedChatRoomId={selectedChatRoomId}
          message={message}
        />
      )
    },
    {
      name: 'reply',
      label: <AppText additionalClassName="message-menu__el-text">{t(MESSAGE_MENU_I18N.reply)}</AppText>,
      handler: (evt: unknown) => {
        stopPropagation(evt)
        replyMessageHandler(message)
      }
    },
    {
      name: 'forward',
      label: <AppText additionalClassName="message-menu__el-text">{t(MESSAGE_MENU_I18N.forward)}</AppText>,
      handler: (evt: unknown) => {
        stopPropagation(evt)
        forwardMessageHandler()
      }
    },
    {
      name: 'delete',
      label: <AppText additionalClassName="message-menu__el-text">{t(MESSAGE_MENU_I18N.delete)}</AppText>,
      handler: (evt: unknown) => {
        stopPropagation(evt)
        deleteMessageHandler(selectedChatRoomId, message.id)
      }
    }
  ]

  return (
    <>
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
      <AppModal title={t(MESSAGE_MENU_I18N.forwardModalTitle)} open={isOpen} onClose={closeForwardMessageModal}>
        <ForwardMessageModal onClose={closeForwardMessageModal} />
      </AppModal>
    </>
  )
}
