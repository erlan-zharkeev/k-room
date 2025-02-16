import { ReactElement } from 'react'
import { useTypedSelector } from 'src/hooks'
import { ContactList, ChatRoomList, UserSettings, Calls } from './elements'
import { WidgetWrapper } from '../shared'

export const AsidePanel = () => {
  const { asideTab } = useTypedSelector((state) => state.persist.settings)

  const TabComponents: Record<string, ReactElement> = {
    contacts: <ContactList />,
    chatList: <ChatRoomList />,
    calls: <Calls />,
    settings: <UserSettings />
  }

  return (
    <div className="aside-panel">
      <WidgetWrapper>
        <div className="aside-panel__content">{TabComponents[asideTab]}</div>
      </WidgetWrapper>
    </div>
  )
}
