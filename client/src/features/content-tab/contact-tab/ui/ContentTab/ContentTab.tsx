import './style.scss'
import { ContentTabType } from 'common-types'

import { CallsButton } from 'src/entities/call'
import { ChatRoomsButton } from 'src/entities/chat-room'
import { ContactsButton } from 'src/entities/contact'
import { SettingsButton, useSettings } from 'src/entities/settings'

import { createClassNameWithModifiers } from 'src/shared/utils'

import { useContentTabSelect } from '../../../select-content-tab'

interface ContentTabButton {
  Component: () => JSX.Element | null
  value: ContentTabType
}

const buttons: ContentTabButton[] = [
  { Component: ContactsButton, value: 'contacts' },
  { Component: ChatRoomsButton, value: 'chat-rooms' },
  { Component: CallsButton, value: 'calls' },
  { Component: SettingsButton, value: 'settings' }
]

export const ContentTab = () => {
  const { selectedContentTab } = useSettings()
  const { selectContentTab } = useContentTabSelect()

  const tabElementClass = (value: ContentTabType) =>
    createClassNameWithModifiers({
      rootClass: 'content-tab__button-el',
      modifiers: [value === selectedContentTab && 'active']
    })

  return (
    <div className="content-tab">
      {buttons.map(({ Component, value }) => (
        <div key={value} className={tabElementClass(value)} onClick={() => selectContentTab(value)}>
          <Component />
        </div>
      ))}
    </div>
  )
}
