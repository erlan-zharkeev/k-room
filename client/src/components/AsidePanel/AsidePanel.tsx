import useTypedSelector from 'src/hooks/useTypedSelector'
import AsidePanelControl from './Components/AsidePanelControl/AsidePanelControl'
import ChatRoomList from './Components/ChatRoomList/ChatRoomList'
import ContactList from './Components/ContactList/ContactList'
import UserSettings from './Components/UserSettings/UserSettings'
import { ReactElement } from 'react'

const AsidePanel = () => {
  const { asideTab } = useTypedSelector((state) => state.persist.settings)
  const TabComponents: { [key: string]: ReactElement } = {
    users: <ContactList />,
    chatList: <ChatRoomList />,
    settings: <UserSettings />
  }

  return (
    <div className="aside-panel">
      <div className="aside-panel__content">{TabComponents[asideTab]}</div>
      <AsidePanelControl />
    </div>
  )
}

export default AsidePanel
