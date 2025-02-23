import { Radio } from 'antd'
import { SettingsButton, useSettings } from 'src/entities/settings'
import { AdminPanelButton } from 'src/entities/user'
import { ContactsButton } from 'src/entities/contact'
import { CallsButton } from 'src/entities/call'
import { ChatRoomsButton } from 'src/entities/chat-room'

const buttons = [
  { Component: AdminPanelButton, value: 'admin-panel' },
  { Component: ContactsButton, value: 'contacts' },
  { Component: ChatRoomsButton, value: 'chat-list' },
  { Component: CallsButton, value: 'calls' },
  { Component: SettingsButton, value: 'settings' }
]

export const AsideNavigation = () => {
  const { selectedContentElement, changeAsideTab } = useSettings()

  return (
    <div className="aside-navigation">
      <Radio.Group value={selectedContentElement} onChange={changeAsideTab}>
        {buttons.map(({ Component, value }) => (
          <div key={value} className="aside-bar__button-el">
            <Component />
          </div>
        ))}
      </Radio.Group>
    </div>
  )
}
