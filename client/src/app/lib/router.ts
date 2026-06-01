import { CONTENT_TAB_IDS, type ContentTab, type DeviceSetting } from 'src/entities/setting'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { DEFAULT_SETTINGS_CONTENT_ID } from 'src/pages/settings'

export const getAppPathFromSettings = ({ contentTab, chatRoomId }: DeviceSetting) => {
  const getChatRoomPath = (id: string) => (id ? `${APP_PAGE_ROUTES.chatRooms}/${id}` : APP_PAGE_ROUTES.chatRooms)

  if (contentTab === 'chat-rooms') return getChatRoomPath(chatRoomId)
  if (contentTab === 'calls') return APP_PAGE_ROUTES.calls
  if (contentTab === 'contacts') return APP_PAGE_ROUTES.contacts
  return `${APP_PAGE_ROUTES.settings}/${DEFAULT_SETTINGS_CONTENT_ID}`
}

export const getContentTabFromPath = (path: string) => {
  const isContentTab = (value?: string): value is ContentTab =>
    Boolean(value && CONTENT_TAB_IDS.includes(value as ContentTab))
  const tab = path.split('/').filter(Boolean)[1]

  return isContentTab(tab) ? tab : undefined
}
