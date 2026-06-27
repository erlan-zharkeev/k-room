import { CONTENT_TAB_IDS, type ContentTab, type DeviceSetting } from 'src/entities/setting'
import { APP_PAGE_ROUTES, getChatRoomContentRoutePath } from 'src/features/app-navigation'
import { DEFAULT_SETTINGS_CONTENT_ID } from 'src/pages/settings'

export const getAppPathFromSettings = ({ contentTab, chatRoomId }: DeviceSetting) => {
  const chatRoomContentPath = getChatRoomContentRoutePath(contentTab, chatRoomId)

  if (chatRoomContentPath) return chatRoomContentPath
  return `${APP_PAGE_ROUTES.settings}/${DEFAULT_SETTINGS_CONTENT_ID}`
}

export const getContentTabFromPath = (path: string) => {
  const isContentTab = (value?: string): value is ContentTab =>
    Boolean(value && CONTENT_TAB_IDS.includes(value as ContentTab))
  const tab = path.split('/').filter(Boolean)[1]

  return isContentTab(tab) ? tab : undefined
}
