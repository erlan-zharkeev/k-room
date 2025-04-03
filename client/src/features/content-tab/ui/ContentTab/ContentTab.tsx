import './style.scss'
import { SettingsButton, useSettings } from 'src/entities/settings'
import { ContactsButton } from 'src/entities/contact'
import { CallsButton } from 'src/entities/call'
import { ChatRoomsButton } from 'src/entities/chat-room'
import { ContentTabType } from 'common-types'

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
  const { selectedContentElement, changeContentTabSelection } = useSettings()

  return (
    <div className="content-tab">
      {buttons.map(({ Component, value }) => (
        <div
          key={value}
          className={`content-tab__button-el ${
            value === selectedContentElement ? 'content-tab__button-el--active' : ''
          }`}
          onClick={() => changeContentTabSelection(value)}
        >
          <Component />
        </div>
      ))}
    </div>
  )
}
