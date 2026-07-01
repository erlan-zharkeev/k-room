import { getAppCallPath, getAppChatRoomPath, getAppContactPath } from 'global-shared'

import type { ContentTab } from 'src/entities/setting'

export const getChatRoomContentRoutePath = (contentTab: ContentTab, chatRoomId: string) => {
  if (contentTab === 'chat-rooms') return getAppChatRoomPath(chatRoomId)
  if (contentTab === 'calls') return getAppCallPath(chatRoomId)
  if (contentTab === 'contacts') return getAppContactPath(chatRoomId)
}
