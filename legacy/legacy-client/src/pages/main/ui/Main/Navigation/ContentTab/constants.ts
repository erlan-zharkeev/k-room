import { createElement } from 'react'

import { Badge } from 'antd'

// import { CallsButton } from 'src/entities/call'
import { ContactsButton } from 'src/entities/contact'

import { SettingsButton } from 'src/shared/preferences'
import { AppButton } from 'src/shared/ui'

import { IContentTabButton } from './content-tab.types.ts'
import { useMessage } from '../../../../model/use-message'

const ChatRoomsTabButton = () => {
  const { messages } = useMessage()
  const unreadMessageQuantity = messages.filter((message) => message.status === 'delivered' && !message.isSelf).length

  return createElement(
    Badge,
    { color: 'var(--accent)', count: unreadMessageQuantity, size: 'small', offset: ['-8px', '5px'] },
    createElement(AppButton, { prefixIconName: 'chat', borderless: true })
  )
}

export const BUTTONS: IContentTabButton[] = [
  { Component: ContactsButton, value: 'contacts' },
  { Component: ChatRoomsTabButton, value: 'chat-rooms' },
  // { Component: CallsButton, value: 'calls' },
  { Component: SettingsButton, value: 'settings' }
]
