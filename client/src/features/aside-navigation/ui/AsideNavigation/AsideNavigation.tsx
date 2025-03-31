import './style.scss'
import { SettingsButton, useSettings } from 'src/entities/settings'
import { ContactsButton } from 'src/entities/contact'
import { CallsButton } from 'src/entities/call'
import { ChatRoomsButton } from 'src/entities/chat-room'
import { SelectedContentElementType } from 'common-types'

interface AsideNavigationButton {
  Component: () => JSX.Element | null
  value: SelectedContentElementType
}

const buttons: AsideNavigationButton[] = [
  { Component: ContactsButton, value: 'contacts' },
  { Component: ChatRoomsButton, value: 'chat-list' },
  { Component: CallsButton, value: 'calls' },
  { Component: SettingsButton, value: 'settings' }
]

export const AsideNavigation = () => {
  const { selectedContentElement, changeAsideTab } = useSettings()

  return (
    <div className="aside-navigation">
      {buttons.map(({ Component, value }) => (
        <div
          key={value}
          className={`aside-navigation__button-el ${
            value === selectedContentElement ? 'aside-navigation__button-el--active' : ''
          }`}
          onClick={() => changeAsideTab(value)}
        >
          <Component />
        </div>
      ))}
    </div>
  )
}
