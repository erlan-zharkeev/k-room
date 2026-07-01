import { getAppSettingsPath } from 'global-shared'

import { CONTENT_TAB_IDS, type ContentTab, type DeviceSetting } from 'src/entities/setting'
import { getChatRoomContentRoutePath } from 'src/features/app-navigation'
import { getSettingsContentId } from 'src/pages/settings'

export const getAppPathFromSettings = ({ contentTab, chatRoomId, settingsContentId }: DeviceSetting) => {
  const chatRoomContentPath = getChatRoomContentRoutePath(contentTab, chatRoomId)

  if (chatRoomContentPath) return chatRoomContentPath
  return getAppSettingsPath(getSettingsContentId(settingsContentId))
}

export const getContentTabFromPath = (path: string) => {
  const isContentTab = (value?: string): value is ContentTab =>
    Boolean(value && CONTENT_TAB_IDS.includes(value as ContentTab))
  const tab = path.split('/').filter(Boolean)[1]

  return isContentTab(tab) ? tab : undefined
}
