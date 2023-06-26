import useTypedSelector from 'src/hooks/useTypedSelector'
import ChatRoomList from './Components/ChatRoomList/ChatRoomList'
import ContactList from './Components/ContactList/ContactList'
import UserSettings from './Components/UserSettings/UserSettings'
import Calls from './Components/Calls/Calls'
import { ReactElement } from 'react'

const AsidePanel = () => {
  const { asideTab } = useTypedSelector((state) => state.persist.settings)
  const TabComponents: Record<string, ReactElement> = {
    contacts: <ContactList />,
    chatList: <ChatRoomList />,
    calls: <Calls />,
    settings: <UserSettings />
  }

  return (
    <div className="aside-panel">
      <div className="aside-panel__content">{TabComponents[asideTab]}</div>
    </div>
  )
}

export default AsidePanel
