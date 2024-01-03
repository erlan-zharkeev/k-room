import { AsideBarButtonName } from 'common-types'
import { useState, ReactElement, useEffect } from 'react'
import { clientConstants } from 'src/client-constants'
import { useTypedSelector } from 'src/hooks'
import { ContactList, ChatRoomList, UserSettings, Calls } from './elements'
import { WidgetWrapper } from '../shared'

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
      <WidgetWrapper loading={isLoading} wallpaperPlacement="aside">
        <div className="aside-panel__content">{TabComponents[asideTab]}</div>
      </WidgetWrapper>
    </div>
  )
}
