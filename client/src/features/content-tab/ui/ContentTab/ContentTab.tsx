import './style.scss'
import { ContentTabType } from 'common-types'

import { CallsButton } from 'src/entities/call'
import { ChatRoomsButton } from 'src/entities/chat-room'
import { ContactsButton } from 'src/entities/contact'
import { SettingsButton, useSettings } from 'src/entities/settings'

import { useContentTabSelect } from '../../select-content-tab'

interface ContentTabButton {
  Component: () => JSX.Element | null
  value: ContentTabType
}

const buttons: ContentTabButton[] = [
  { Component: ContactsButton, value: 'contacts' },
  { Component: ChatRoomsButton, value: 'chat-list' },
  { Component: CallsButton, value: 'calls' },
  { Component: SettingsButton, value: 'settings' }
]

export const ContentTab = () => {
  const { selectedContentTab } = useSettings()
  const { selectContentTab } = useContentTabSelect()

  return (
    <div className="content-tab">
      {buttons.map(({ Component, value }) => (
        <div
          key={value}
          className={`content-tab__button-el ${value === selectedContentTab ? 'content-tab__button-el--active' : ''}`}
          onClick={() => selectContentTab(value)}
        >
          <Component />
        </div>
      ))}
    </div>
  )
}
