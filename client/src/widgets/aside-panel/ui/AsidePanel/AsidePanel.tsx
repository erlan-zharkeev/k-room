import './style.scss'
import { ReactElement } from 'react'
import { ContactList, ChatRoomList, UserSettings, Calls } from './elements'
import { ContentTabType } from 'common-types'
import { useTypedSelector } from 'src/shared/lib'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

export const AsidePanel = () => {
  const { selectedContentElement } = useTypedSelector((state) => state.persist.settings)
  const TabComponents: Record<Exclude<ContentTabType, 'admin-panel' | 'info'>, ReactElement> = {
    contacts: <ContactList />,
    'chat-list': <ChatRoomList />,
    calls: <Calls />,
    settings: <UserSettings />
  }
  return (
    <div className="aside-panel">
      <WidgetWrapper placement="aside-panel">
        <div className="aside-panel__content">
          {selectedContentElement in TabComponents
            ? TabComponents[selectedContentElement as keyof typeof TabComponents]
            : ''}
        </div>
      </WidgetWrapper>
    </div>
  )
}
