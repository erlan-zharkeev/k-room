import { CallsButton } from 'src/entities/call'
import { ChatRoomsButton } from 'src/entities/chat-room'
import { ContactsButton } from 'src/entities/contact'
import { SettingsButton } from 'src/entities/settings'

import { IContentTabButton } from './types'

export const BUTTONS: IContentTabButton[] = [
  { Component: ContactsButton, value: 'contacts' },
  { Component: ChatRoomsButton, value: 'chat-rooms' },
  { Component: CallsButton, value: 'calls' },
  { Component: SettingsButton, value: 'settings' }
]
