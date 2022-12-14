import useTypedSelector from 'src/hooks/useTypedSelector'
import AsidePanelControl from './Components/AsidePanelControl/AsidePanelControl'
import ChatRoomList from './Components/ChatRoomList/ChatRoomList'
import ContactList from './Components/ContactList/ContactList'
import UserSettings from './Components/UserSettings/UserSettings'

const AsidePanel = () => {
  const { asideTab } = useTypedSelector((state) => state.persist.system)
  const TabComponents = {
    users: <ContactList />,
    // calls: <span>calls</span>,
    chatList: <ChatRoomList />,
    settings: <UserSettings />
  } as any

  return (
    <div className="aside-panel">
      <div className="aside-panel__content">{TabComponents[asideTab]}</div>
      <AsidePanelControl />
    </div>
  )
}

export default AsidePanel
