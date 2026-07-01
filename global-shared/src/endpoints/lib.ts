import { APP_ROUTE_PATHS } from './constants'

const appendPathSegment = (path: string, segment = '') => (segment ? `${path}/${segment}` : path)

export const getAppChatRoomPath = (chatRoomId = '') => appendPathSegment(APP_ROUTE_PATHS.chatRooms, chatRoomId)

export const getAppCallPath = (chatRoomId = '') => appendPathSegment(APP_ROUTE_PATHS.calls, chatRoomId)

export const getAppContactPath = (chatRoomId = '') => appendPathSegment(APP_ROUTE_PATHS.contacts, chatRoomId)

export const getAppSettingsPath = (settingsId = '') => appendPathSegment(APP_ROUTE_PATHS.settings, settingsId)
