import { APP_NAVIGATION_I18N } from 'src/features/app-navigation'

export const CONTENT_LAYOUT_EXCLUDED_ROUTE_SEGMENTS = ['chat-rooms', 'calls', 'contacts']
export const TABLET_APP_LAYOUT_CONTENT_VIEW = 'content'
const TABLET_APP_LAYOUT_NAVIGATION_VIEW = 'content-navigation'
export const TABLET_APP_LAYOUT_DEFAULT_VIEW = TABLET_APP_LAYOUT_NAVIGATION_VIEW
export const TABLET_APP_LAYOUT_VIEWS = [TABLET_APP_LAYOUT_CONTENT_VIEW, TABLET_APP_LAYOUT_NAVIGATION_VIEW] as const

export const ROUTE_TITLE_MAP = {
  'chat-rooms': APP_NAVIGATION_I18N.chatRooms,
  calls: APP_NAVIGATION_I18N.calls,
  contacts: APP_NAVIGATION_I18N.contacts,
  settings: APP_NAVIGATION_I18N.settings
} as const
