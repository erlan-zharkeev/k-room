import { AsideBarButtonName } from 'common-types'
import { useState, ReactElement, useEffect } from 'react'
import { clientConstants } from 'src/client-constants'
import { useTypedSelector } from 'src/hooks'
import { WidgetLoader } from '..'
import { Calls } from 'src/components/AsidePanel/components/Calls/Calls'
import { ChatRoomList } from 'src/components/AsidePanel/components/ChatRoomList/ChatRoomList'
import { ContactList } from 'src/components/AsidePanel/components/ContactList/ContactList'
import { UserSettings } from 'src/components/AsidePanel/components/UserSettings/UserSettings'

export const AsidePanel = () => {
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
    }, clientConstants.asidePanelLoaderMinDuration)
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
