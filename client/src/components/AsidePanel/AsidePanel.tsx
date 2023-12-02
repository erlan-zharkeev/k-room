import { AsideBarButtonName } from 'common-types'
import { useState, ReactElement, useEffect } from 'react'
import { constants } from 'src/constants'
import { useTypedSelector } from 'src/hooks'
import { WidgetLoader } from '..'
import { ContactList, ChatRoomList, Calls, UserSettings } from './components'

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
