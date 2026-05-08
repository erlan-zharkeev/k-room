import './style.scss'
import { ReactElement } from 'react'

import { ContentTabType } from 'src/shared/config'
import { useSettings } from 'src/shared/preferences'
import { WidgetWrapper } from 'src/shared/ui'

import { Calls } from '../Calls/Calls'
import { ChatRooms } from '../ChatRooms/ChatRooms'
import { Contacts } from '../Contacts/Contacts'
import { Settings } from '../Settings/Settings'

export const AsidePanel = () => {
  const { showAsidePanel, selectedContentTab } = useSettings()

  const TAB_COMPONENTS_MAP: Record<ContentTabType, ReactElement> = {
    contacts: <Contacts />,
    'chat-rooms': <ChatRooms />,
    calls: <Calls />,
    settings: <Settings />
  }

  return (
    <>
      {showAsidePanel && (
        <WidgetWrapper name="aside-panel">
          <div className="aside-panel__content">
            {selectedContentTab in TAB_COMPONENTS_MAP
              ? TAB_COMPONENTS_MAP[selectedContentTab as keyof typeof TAB_COMPONENTS_MAP]
              : ''}
          </div>
        </WidgetWrapper>
      )}
    </>
  )
}
