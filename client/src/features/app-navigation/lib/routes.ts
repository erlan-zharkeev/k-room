import type { ContentTab } from 'src/entities/setting'

import { APP_PAGE_ROUTES } from '../config/constants'

const appendChatRoomId = (path: string, chatRoomId: string) => (chatRoomId ? `${path}/${chatRoomId}` : path)

const getChatRoomContentRouteBasePath = (contentTab: ContentTab) => {
  if (contentTab === 'chat-rooms') return APP_PAGE_ROUTES.chatRooms
  if (contentTab === 'calls') return APP_PAGE_ROUTES.calls
  if (contentTab === 'contacts') return APP_PAGE_ROUTES.contacts
}

export const getChatRoomContentRoutePath = (contentTab: ContentTab, chatRoomId: string) => {
  const path = getChatRoomContentRouteBasePath(contentTab)

  return path && appendChatRoomId(path, chatRoomId)
}
