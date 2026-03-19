import { ReactNode } from 'react'

import { ChatRoomSettingsModal, CreateChatRoomModal } from 'src/features/chat-room'
import { SelectDevicesModal } from 'src/features/device'
import { ForwardMessageModal, MessageWithBindDataModal, MessageWithBindDataModalMenu } from 'src/features/message'
import { EditUserDataModal } from 'src/features/user'

import type { ModalContentComponentName } from './types'

const Popups: Record<ModalContentComponentName, ReactNode> = {
  'edit-user-data-modal': <EditUserDataModal />,
  'select-devices-modal': <SelectDevicesModal />,
  'forward-message-modal': <ForwardMessageModal />,
  'create-chat-room-modal': <CreateChatRoomModal />,
  'chat-room-settings-modal': <ChatRoomSettingsModal />,
  'message-with-bind-data-modal': <MessageWithBindDataModal />
}

const AdditionalDropdownMenuElements: Partial<Record<ModalContentComponentName, ReactNode>> = {
  'message-with-bind-data-modal': <MessageWithBindDataModalMenu />
}

export { Popups, AdditionalDropdownMenuElements }
