import './style.scss'
import { ReactElement } from 'react'

import { Calls, ChatRooms, Contacts } from 'src/widgets/aside-panel'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

import { UserSettings } from 'src/features/settings'

import { useSettings } from 'src/entities/settings'

import { ContentTabType } from 'src/shared/config'

export const AsidePanel = () => {
  const { showAsidePanel, selectedContentTab } = useSettings()

  const TAB_COMPONENTS_MAP: Record<Exclude<ContentTabType, 'info'>, ReactElement> = {
    contacts: <Contacts />,
    'chat-rooms': <ChatRooms />,
    calls: <Calls />,
    settings: <UserSettings />
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
