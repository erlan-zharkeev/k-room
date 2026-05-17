import { APP_LAYOUT_I18N } from './i18n'

export const CONTENT_LAYOUT_EXCLUDED_ROUTE_SEGMENTS = ['chat-rooms']

export const ROUTE_TITLE_MAP = {
  'chat-rooms': APP_LAYOUT_I18N.chatRooms,
  calls: APP_LAYOUT_I18N.calls,
  contacts: APP_LAYOUT_I18N.contacts,
  settings: APP_LAYOUT_I18N.settings
} as const
