import useTypedSelector from 'src/hooks/useTypedSelector'
import ChatRoomList from './Components/ChatRoomList/ChatRoomList'
import ContactList from './Components/ContactList/ContactList'
import UserSettings from './Components/UserSettings/UserSettings'
import Calls from './Components/Calls/Calls'
import { ReactElement, useEffect, useState } from 'react'
import { WidgetLoader } from '../Common/WidgetLoader/WidgetLoader'
import constants from 'src/constants'
import { AsideBarButtonName } from '../AsideBar/@types/ButtonsListElement'

const AsidePanel = () => {
  const { asideTab } = useTypedSelector((state) => state.persist.settings)
  const contactListLoading = useTypedSelector((state) => state.contacts.isLoading)
  const roomListIsLoading = useTypedSelector((state) => state.chatRooms.isLoading)
  const [isLoading, setIsLoading] = useState(true)

  const TabComponents: Record<string, ReactElement> = {
    contacts: <ContactList />,
    chatList: <ChatRoomList />,
    calls: <Calls />,
    settings: <UserSettings />
  }

  useEffect(() => {
    const contactsLoading = asideTab === AsideBarButtonName.contacts && contactListLoading
    const roomsIsLoading = asideTab === AsideBarButtonName.chatList && roomListIsLoading
    setTimeout(() => {
      setIsLoading(contactsLoading && roomsIsLoading)
    }, constants.asidePanelLoaderMinDuration)
  }, [contactListLoading, roomListIsLoading])

  return (
    <div className="aside-panel">
      <div className="aside-panel__content">
        <WidgetLoader hide={!isLoading} />
        {TabComponents[asideTab]}
      </div>
    </div>
  )
}

export default AsidePanel
